import React from 'react';
import {
  ORDER_STATUSES,
  getCustomerFacingStatus,
  getStatusStage,
  getStatusLabel,
} from '../services/orderService.js';

const STEP_ICONS = ['🛒', '✉️', '✂️', '🔍', '📦', '🚚', '🏡'];

/**
 * Renders the canonical Flora Alchemy order lifecycle:
 * new → confirmed → in_production → quality_check → ready_to_dispatch → shipped → delivered
 * The active step is derived from the shared order record (order.orderStatus),
 * so customer-facing views always reflect the same state the Handler Portal writes.
 */
export default function OrderStatusTracker({ order }) {
  if (!order) return null;

  const currentStage = getStatusStage(order.orderStatus || 'new');
  const currentLabel = getCustomerFacingStatus(order.orderStatus || 'new');
  const rawLabel = getStatusLabel(order.orderStatus || 'new');

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e2dd] pb-5">
        <div>
          <p className="text-[12px] font-bold text-[#964735]">Order #{order.id || order.orderId}</p>
          <p className="text-[11px] text-[#80756f]">
            Status · <span className="font-bold uppercase text-[#964735]">{rawLabel}</span>
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[13px] font-semibold text-[#180f0a]">
            Current stage: <span className="text-[#964735]">{currentLabel}</span>
          </p>
          {order.trackingNumber && (
            <p className="text-[12px] text-[#80756f]">
              Tracking: <span className="font-mono font-bold text-[#180f0a]">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      </div>

      {/* Step rail */}
      <div className="py-6">
        <div className="relative">
          <div className="absolute left-0 top-[15px] h-1 bg-[#ebe8e3] w-full z-0 rounded-full" />
          <div
            className="absolute left-0 top-[15px] h-1 bg-[#964735] transition-all duration-700 z-0 rounded-full"
            style={{ width: `${Math.max(0, ((currentStage - 1) / (ORDER_STATUSES.length - 1)) * 100)}%` }}
          />
          <div className="relative z-10 grid grid-cols-7 gap-1">
            {ORDER_STATUSES.map((step, idx) => {
              const stageNum = idx + 1;
              const done = currentStage >= stageNum;
              const isCurrent = currentStage === stageNum;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px] shadow-sm ${
                      done ? (isCurrent ? 'bg-[#964735] text-white animate-pulse' : 'bg-[#180f0a] text-white') : 'bg-[#ebe8e3] text-[#4e4540]'
                    }`}
                    aria-hidden="true"
                  >
                    {done && !isCurrent ? '✓' : STEP_ICONS[idx]}
                  </div>
                  <span className={`text-[10px] mt-2 leading-tight ${done ? 'font-bold text-[#180f0a]' : 'text-[#80756f]'}`}>
                    {getCustomerFacingStatus(step.key)}
                  </span>
                  {idx === 0 && (
                    <span className="text-[9px] text-[#a89f99] hidden sm:block">{step.description}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
