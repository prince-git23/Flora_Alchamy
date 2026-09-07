import Order, { ORDER_STATUSES } from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';

/**
 * All analytics derive from the canonical collections — no hardcoded KPIs.
 */
export async function computeOverview() {
  const [orderStats, customerCount, productCount, inventoryDocs] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: { $sum: '$total' },
        },
      },
    ]),
    Customer.countDocuments({ isFixture: { $ne: true } }),
    Product.countDocuments({ visibility: 'Visible' }),
    Inventory.find({}),
  ]);

  const totals = orderStats[0] || { orders: 0, revenue: 0 };
  const byStatus = {};
  for (const s of ORDER_STATUSES) byStatus[s] = 0;
  const statusRows = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);
  for (const row of statusRows) {
    if (row._id in byStatus) byStatus[row._id] = row.count;
  }

  const lowStock = inventoryDocs.filter(
    (i) => i.currentStock <= i.reorderLevel
  ).length;

  return {
    totalOrders: totals.orders,
    totalRevenue: totals.revenue,
    averageOrderValue: totals.orders ? Math.round(totals.revenue / totals.orders) : 0,
    totalCustomers: customerCount,
    visibleProducts: productCount,
    statusDistribution: byStatus,
    lowStockItems: lowStock,
    pendingOrders: (byStatus.new || 0) + (byStatus.confirmed || 0),
    inProduction: byStatus.in_production || 0,
  };
}

export async function computeSales(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const productRows = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        quantity: { $sum: '$items.quantity' },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 8 },
  ]);

  return {
    days,
    daily: rows,
    topProducts: productRows.map((r) => ({
      name: r._id,
      revenue: r.revenue,
      quantity: r.quantity,
    })),
  };
}

export async function computePerformance() {
  const [customers, orders] = await Promise.all([
    Customer.find({}).sort({ createdAt: 1 }).lean(),
    Order.find({}).sort({ createdAt: -1 }).lean(),
  ]);

  const customerRows = customers.map((c) => {
    const own = orders.filter((o) => String(o.customerId) === String(c._id));
    const spend = own.reduce((sum, o) => sum + o.total, 0);
    return {
      name: c.name,
      email: c.email,
      orders: own.length,
      spend: Math.round(spend),
      status: c.status,
    };
  });

  return {
    customerPerformance: customerRows.sort((a, b) => b.spend - a.spend).slice(0, 10),
  };
}
