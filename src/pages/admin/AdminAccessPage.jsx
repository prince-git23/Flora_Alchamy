import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import AdminSettingsTabs from '../../components/admin/AdminSettingsTabs.jsx';
import {
  getAdminUsers,
  addAdminUser,
  updateAdminUserStatus,
  deleteAdminUser
} from '../../services/adminSettings.js';

export default function AdminAccessPage() {
  const [viewState, setViewState] = useState('normal'); // 'normal' | 'skeleton' | 'empty'
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('HANDLER');

  useEffect(() => {
    setUsers(getAdminUsers());
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddHandler = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const updated = addAdminUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: 'INVITED'
    });
    setUsers(updated);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddModal(false);
    triggerToast(`Sent workstation credentials invite to ${newUserEmail}`);
  };

  const handleStatusChange = (userId, newStatus, userEmail) => {
    const updated = updateAdminUserStatus(userId, newStatus);
    setUsers(updated);
    triggerToast(`Updated operator status to ${newStatus.toLowerCase()} (${userEmail})`);
  };

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to remove ${userName} from the operational roster?`)) {
      const updated = deleteAdminUser(userId);
      setUsers(updated);
      triggerToast(`Removed ${userName} from roster`);
    }
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Name', 'Role', 'Email', 'Status', 'Last Activity'],
      ...users.map((u) => [u.name, u.role, u.email, u.status, u.lastActivity])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'flora_alchemy_access_roster.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Access log exported successfully');
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    return matchesQuery && matchesRole && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Banner Card Header */}
        <div className="relative overflow-hidden rounded-2xl bg-[#f6f3ee] p-6 sm:p-8 shadow-xs border border-[#e5e2dd]">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#ffdad3]/40 via-[#f1dfd5]/30 to-transparent blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-1.5 text-[13px] text-[#80756f]">
                <span>System</span>
                <span className="text-[#d1c4bd]">/</span>
                <span>Settings</span>
                <span className="text-[#d1c4bd]">/</span>
                <span className="text-[#180f0a] font-semibold">Admin & Handler Access</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#180f0a] tracking-tight font-normal">
                  Admin & Handler Access
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad3] text-[#783020] text-[11px] font-bold shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#964735]"></span>
                  Sample Data Environment
                </span>
              </div>

              <p className="text-[15px] text-[#4e4540]">
                Manage portal access, roles, and account permissions for store operators.
              </p>
            </div>

            {/* Prototype View State Switcher */}
            <div className="flex items-center gap-1.5 bg-[#e5e2dd]/70 p-1.5 rounded-full shadow-inner self-start md:self-auto">
              <span className="text-[#4e4540] text-[11px] font-bold px-2 uppercase tracking-wider">
                State:
              </span>
              <button
                type="button"
                onClick={() => setViewState('normal')}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                  viewState === 'normal'
                    ? 'bg-white shadow-xs text-[#180f0a]'
                    : 'text-[#4e4540] hover:text-[#180f0a]'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setViewState('skeleton')}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                  viewState === 'skeleton'
                    ? 'bg-white shadow-xs text-[#180f0a]'
                    : 'text-[#4e4540] hover:text-[#180f0a]'
                }`}
              >
                Skeleton
              </button>
              <button
                type="button"
                onClick={() => setViewState('empty')}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                  viewState === 'empty'
                    ? 'bg-white shadow-xs text-[#180f0a]'
                    : 'text-[#4e4540] hover:text-[#180f0a]'
                }`}
              >
                Empty Sample
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="mt-6 pt-2 border-t border-[#e5e2dd]/60">
            <AdminSettingsTabs activeTab="access" />
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between text-[#80756f]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Administrators</span>
              <span className="material-symbols-outlined text-[#180f0a] text-[20px]">shield_person</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-[#180f0a]">2</span>
              <span className="text-[11px] font-bold text-[#80756f]">PROFILES</span>
            </div>
            <p className="mt-1 text-[13px] text-[#4e4540]">Full system governance & security</p>
            <div className="mt-3 pt-2 border-t border-[#f6f3ee] flex items-center gap-1.5 text-[#1d2918] text-[11px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1d2918]"></span>
              Both 2FA Enforcement Active
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between text-[#80756f]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Handlers</span>
              <span className="material-symbols-outlined text-[#180f0a] text-[20px]">palette</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-[#180f0a]">6</span>
              <span className="text-[11px] font-bold text-[#80756f]">OPERATORS</span>
            </div>
            <p className="mt-1 text-[13px] text-[#4e4540]">Orders, inventory & catalog management</p>
            <div className="mt-3 pt-2 border-t border-[#f6f3ee] flex items-center gap-1.5 text-[#4e4540] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">cloud_download</span>
              Average session length 4.2 hrs
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between text-[#80756f]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Invites</span>
              <span className="material-symbols-outlined text-[#964735] text-[20px]">forward_to_inbox</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-[#964735]">1</span>
              <span className="text-[11px] font-bold text-[#772f1f]">INVITE</span>
            </div>
            <p className="mt-1 text-[13px] text-[#4e4540]">Awaiting credential activation</p>
            <div className="mt-3 pt-2 border-t border-[#f6f3ee] flex items-center gap-1.5 text-[#964735] text-[11px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#964735] animate-pulse"></span>
              Expiring in 48 hours
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between text-[#80756f]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Sessions</span>
              <span className="material-symbols-outlined text-[#1d2918] text-[20px]">devices</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-medium text-[#180f0a]">3</span>
              <span className="text-[11px] font-bold text-[#80756f]">SESSIONS</span>
            </div>
            <p className="mt-1 text-[13px] text-[#4e4540]">Authenticated browser windows</p>
            <div className="mt-3 pt-2 border-t border-[#f6f3ee] flex items-center gap-1.5 text-[#4e4540] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">lock_reset</span>
              Sample Session Management • Standard Protocol
            </div>
          </div>
        </div>

        {/* Admin & Handler Directory (Primary Table Card) */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6">
            <div>
              <h2 className="font-serif text-2xl text-[#180f0a] font-medium">
                Admin & Handler Directory
              </h2>
              <p className="text-[13px] text-[#4e4540] mt-0.5">
                Sample operational access roster for store administration and order fulfillment.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f6f3ee] text-[#1c1c19] text-[13px] font-semibold hover:bg-[#ebe8e3] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>Export Access Log (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f6f3ee] text-[#1c1c19] text-[13px] font-semibold hover:bg-[#ebe8e3] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span>Invite User</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>+ Add Handler</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between py-3 px-4 bg-[#f6f3ee] rounded-xl mb-6">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#80756f]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by operator name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white text-[#1c1c19] text-[13px] placeholder:text-[#80756f] focus:outline-none focus:ring-1 focus:ring-[#180f0a] shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-xs text-[13px]">
                <span className="text-[#80756f] text-[11px] font-bold uppercase">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent font-semibold text-[#1c1c19] focus:outline-none cursor-pointer text-[13px]"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                  <option value="HANDLER">Handler</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-xs text-[13px]">
                <span className="text-[#80756f] text-[11px] font-bold uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold text-[#1c1c19] focus:outline-none cursor-pointer text-[13px]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INVITED">Invited</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* VIEW: SKELETON */}
          {viewState === 'skeleton' && (
            <div className="space-y-3 py-2 animate-pulse">
              <div className="h-12 bg-[#f0ede9] rounded-xl w-full"></div>
              <div className="h-14 bg-[#ebe8e3] rounded-xl w-full"></div>
              <div className="h-14 bg-[#f6f3ee] rounded-xl w-full"></div>
              <div className="h-14 bg-[#ebe8e3] rounded-xl w-full"></div>
              <div className="h-14 bg-[#f6f3ee] rounded-xl w-full"></div>
            </div>
          )}

          {/* VIEW: EMPTY SAMPLE */}
          {viewState === 'empty' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f6f3ee] flex items-center justify-center text-[#80756f] mb-3">
                <span className="material-symbols-outlined text-[32px]">folder_off</span>
              </div>
              <h3 className="font-serif text-2xl text-[#180f0a] font-medium">
                No pending invites or inactive users
              </h3>
              <p className="text-[14px] text-[#4e4540] max-w-sm mt-1">
                All handlers are presently operational and active within this sample environment session.
              </p>
              <button
                type="button"
                onClick={() => setViewState('normal')}
                className="mt-4 px-4 py-2 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold shadow-xs hover:bg-[#2e241e]"
              >
                Reset Filter View
              </button>
            </div>
          )}

          {/* VIEW: NORMAL TABLE */}
          {viewState === 'normal' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="text-[#80756f] text-[11px] font-bold uppercase tracking-wider bg-[#f6f3ee]/60">
                    <th className="py-3 px-4 rounded-l-lg">Operator Name</th>
                    <th className="py-3 px-4">Role Delegation</th>
                    <th className="py-3 px-4">Workstation Email</th>
                    <th className="py-3 px-4">Access Status</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4 text-right rounded-r-lg">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede9]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#80756f]">
                        No operators matching the selected search query or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isSuspended = u.status === 'SUSPENDED';
                      const isInvited = u.status === 'INVITED';

                      return (
                        <tr
                          key={u.id}
                          className={`hover:bg-[#f6f3ee]/50 transition-colors ${
                            isSuspended ? 'opacity-75' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shadow-xs ${
                                  u.initials === 'HA'
                                    ? 'bg-[#180f0a] text-white'
                                    : u.initials === 'PS'
                                    ? 'bg-[#fd9882] text-[#772f1f]'
                                    : u.initials === 'RP'
                                    ? 'bg-[#ffdad3] text-[#783020] border border-dashed border-[#964735]'
                                    : isSuspended
                                    ? 'bg-[#e5e2dd] text-[#4e4540]'
                                    : 'bg-[#ebe8e3] text-[#1c1c19]'
                                }`}
                              >
                                {u.initials}
                              </div>
                              <div>
                                <p className="font-semibold text-[#180f0a] leading-tight">{u.name}</p>
                                <p className="text-[11px] text-[#80756f]">{u.title}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {u.role === 'ADMINISTRATOR' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f1dfd5] text-[#231a14] text-[11px] font-bold">
                                <span className="material-symbols-outlined text-[14px]">shield</span>
                                Administrator
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ebe8e3] text-[#1c1c19] text-[11px] font-medium">
                                <span className="material-symbols-outlined text-[14px]">stylus_note</span>
                                Handler
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-[#4e4540] font-mono text-[12px]">
                            {u.email}
                          </td>

                          <td className="py-3.5 px-4">
                            {u.status === 'ACTIVE' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d8e7cd] text-[#131f0e] text-[11px] font-bold">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#081405]"></span>
                                Active
                              </span>
                            ) : isInvited ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdad3] text-[#783020] text-[11px] font-bold">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#964735] animate-pulse"></span>
                                Invited
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e5e2dd] text-[#4e4540] text-[11px] font-bold">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#80756f]"></span>
                                Suspended
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-[#4e4540]">
                            {u.lastActivity === 'Just now' ? (
                              <div className="flex items-center gap-1 text-[#081405] font-medium">
                                <span className="material-symbols-outlined text-[16px] text-[#5b6d54]">check_circle</span>
                                Just now
                              </div>
                            ) : (
                              u.lastActivity
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              {isInvited ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => triggerToast(`Resent invitation credentials to ${u.email}`)}
                                    className="p-1 rounded hover:bg-[#ebe8e3] text-[#964735] hover:text-[#783020] transition-colors"
                                    title="Resend Invite"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(u.id, u.name)}
                                    className="p-1 rounded hover:bg-[#ebe8e3] text-[#80756f] hover:text-[#ba1a1a] transition-colors"
                                    title="Revoke Invite"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                                  </button>
                                </>
                              ) : isSuspended ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(u.id, 'ACTIVE', u.email)}
                                    className="p-1 rounded hover:bg-[#ebe8e3] text-[#80756f] hover:text-[#180f0a] transition-colors"
                                    title="Reactivate Account"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">replay</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(u.id, u.name)}
                                    className="p-1 rounded hover:bg-[#ebe8e3] text-[#ba1a1a] transition-colors"
                                    title="Delete Profile Permanently"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setShowPermissionsModal(u)}
                                    className="p-1 rounded hover:bg-[#ebe8e3] text-[#80756f] hover:text-[#180f0a] transition-colors"
                                    title="Edit Permissions"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">tune</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(u.id, 'SUSPENDED', u.email)}
                                    className="p-1 rounded hover:bg-[#ebe8e3] text-[#80756f] hover:text-[#ba1a1a] transition-colors"
                                    title="Suspend Operator"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-2 border-t border-[#f0ede9] text-[13px] text-[#80756f]">
                <span>Demonstration Roster: Showing {filteredUsers.length} seeded profiles</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1 rounded bg-[#ebe8e3] text-[#180f0a] opacity-50 cursor-not-allowed font-medium"
                  >
                    Previous
                  </button>
                  <span className="px-2 text-[#80756f]">Page 1 of 1</span>
                  <button
                    type="button"
                    disabled
                    className="px-3 py-1 rounded bg-[#ebe8e3] text-[#180f0a] opacity-50 cursor-not-allowed font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Configuration Comparison Matrix Between Administrative and Handler Scopes */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,36,30,0.04)] border border-[#e5e2dd] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-6">
            <div>
              <h2 className="font-serif text-2xl text-[#180f0a] font-medium">
                Scope &amp; Permission Matrix
              </h2>
              <p className="text-[13px] text-[#4e4540] mt-0.5">
                Sample configuration comparison matrix between administrative and handler scopes.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebe8e3] text-[#1c1c19] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              Role Matrix Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[#80756f] text-[11px] font-bold uppercase tracking-wider bg-[#f6f3ee]/60">
                  <th className="py-3 px-4 rounded-l-lg w-1/3">Module / Feature</th>
                  <th className="py-3 px-4 w-1/3">Administrator Role</th>
                  <th className="py-3 px-4 rounded-r-lg w-1/3">Handler Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede9]">
                <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#180f0a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#80756f]">dashboard</span>
                    Dashboard Overview
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Full Access
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Revenue, audit trail &amp; conversion metrics
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1c1c19] font-medium">
                      <span className="material-symbols-outlined text-[16px] text-[#80756f]">visibility</span>
                      View Only
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Fulfillment volume and daily dispatch targets
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#180f0a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#80756f]">shopping_bag</span>
                    Orders Management
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Full Access
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Cancel, refund INR, edit customer notes
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      Manage &amp; Process
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Packaging, dispatch &amp; status updates
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#180f0a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#80756f]">contacts</span>
                    Customers Directory
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Full Access
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      PII records, delivery addresses, export logs
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1c1c19] font-medium">
                      <span className="material-symbols-outlined text-[16px] text-[#80756f]">support_agent</span>
                      View &amp; Support
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Customer contact &amp; order notes
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#180f0a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#80756f]">eco</span>
                    Products &amp; Collections
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Full Access
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Catalog items, collections, and product updates
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      Manage Catalog
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Product tags &amp; photo gallery uploads
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#180f0a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#80756f]">inventory_2</span>
                    Inventory &amp; Stock
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Full Access
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Supplier valuation, ledger write-offs
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      Manage &amp; Adjust
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Inventory stock balances, adjustments, and reorder levels
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#180f0a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#80756f]">insights</span>
                    Analytics &amp; Reports
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Full Access
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Complete financial ledgers &amp; margin reports
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1c1c19] font-medium">
                      <span className="material-symbols-outlined text-[16px] text-[#80756f]">visibility</span>
                      View Only
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Order fulfillment &amp; operational reports
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f6f3ee]/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#180f0a] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#80756f]">settings</span>
                    System Settings
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#1d2918] font-medium">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Full Access
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Security policies, domain tokens, API keys
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#ba1a1a] font-medium">
                      <span className="material-symbols-outlined text-[16px]">block</span>
                      Limited / No Access
                    </span>
                    <span className="block text-[#80756f] text-xs mt-0.5">
                      Restricted from core administrative settings
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-[#f6f3ee] rounded-xl flex items-start gap-2.5 text-[#4e4540]">
            <span className="material-symbols-outlined text-[18px] text-[#80756f] mt-0.5">info</span>
            <p className="text-[13px]">
              Permissions govern operational access rights within the Handler Portal. Changes apply to subsequent sample authentication sessions.
            </p>
          </div>
        </div>

        {/* 3 Bottom Governance & Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#f6f3ee] rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-[#e5e2dd]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#180f0a]">
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                <h3 className="font-serif text-lg font-medium">Two-Factor Authentication</h3>
              </div>
              <p className="text-[13px] text-[#4e4540]">
                Enforced globally across all Administrator and Handler roles in this sample suite.
              </p>
            </div>
            <span className="mt-4 text-[11px] font-bold text-[#1d2918] inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1d2918]"></span> 100% Policy Compliance
            </span>
          </div>

          <div className="bg-[#f6f3ee] rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-[#e5e2dd]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#180f0a]">
                <span className="material-symbols-outlined text-[20px]">timer</span>
                <h3 className="font-serif text-lg font-medium">Idle Session Timeout</h3>
              </div>
              <p className="text-[13px] text-[#4e4540]">
                Inactive sessions automatically sign out after 30 minutes to protect workstation integrity.
              </p>
            </div>
            <span className="mt-4 text-[11px] font-bold text-[#80756f]">
              Sample policy: 30 minutes
            </span>
          </div>

          <div className="bg-[#f6f3ee] rounded-2xl p-6 flex flex-col justify-between shadow-xs border border-[#e5e2dd]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#180f0a]">
                <span className="material-symbols-outlined text-[20px]">history</span>
                <h3 className="font-serif text-lg font-medium">Audit Log Retention</h3>
              </div>
              <p className="text-[13px] text-[#4e4540]">
                All access mutations, credential updates, and privilege elevations persist for 90 days.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="mt-4 text-[12px] font-semibold text-[#964735] hover:underline inline-flex items-center gap-1 text-left"
            >
              Review Audit Log Stream <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Modal: Add Handler / Invite User */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e5e2dd] animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#180f0a]">
                  <span className="material-symbols-outlined text-[22px] text-[#964735]">person_add</span>
                  <h3 className="font-serif text-xl font-medium">Add Handler or Admin</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-[#80756f] hover:bg-[#f0ede9]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddHandler} className="space-y-4 text-[13px]">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#80756f] mb-1">
                    Operator Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Meera Nambiar"
                    className="w-full px-3 py-2 bg-[#f6f3ee] rounded-xl border border-transparent focus:border-[#180f0a] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#80756f] mb-1">
                    Workstation Email
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="e.g. meera.n@flora-alchemy.demo"
                    className="w-full px-3 py-2 bg-[#f6f3ee] rounded-xl border border-transparent focus:border-[#180f0a] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#80756f] mb-1">
                    Role Delegation
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f6f3ee] rounded-xl border border-transparent focus:border-[#180f0a] focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="HANDLER">Handler (Catalog &amp; Packaging)</option>
                    <option value="ADMINISTRATOR">Administrator (Full Access)</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full text-[#4e4540] hover:bg-[#f6f3ee] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#180f0a] text-white hover:bg-[#2e241e] font-semibold shadow-xs"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Permissions */}
        {showPermissionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e5e2dd] animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#180f0a]">
                  <span className="material-symbols-outlined text-[22px] text-[#964735]">tune</span>
                  <h3 className="font-serif text-xl font-medium">
                    Permissions: {showPermissionsModal.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(null)}
                  className="p-1 rounded-lg text-[#80756f] hover:bg-[#f0ede9]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="space-y-3 text-[13px] text-[#4e4540]">
                <p>
                  Current role: <strong className="text-[#180f0a]">{showPermissionsModal.role}</strong>
                </p>
                <div className="p-3 bg-[#f6f3ee] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Order Processing</span>
                    <span className="text-[#1d2918] font-bold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Stock Balances</span>
                    <span className="text-[#1d2918] font-bold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Financial Auditing</span>
                    <span className={showPermissionsModal.role === 'ADMINISTRATOR' ? 'text-[#1d2918] font-bold' : 'text-[#ba1a1a] font-bold'}>
                      {showPermissionsModal.role === 'ADMINISTRATOR' ? 'Enabled' : 'Restricted'}
                    </span>
                  </div>
                </div>
                <p className="text-[12px] text-[#80756f]">
                  Demonstration access control parameters are tied to the prototype operator matrix.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(null)}
                  className="px-5 py-2 rounded-full bg-[#180f0a] text-white font-semibold text-[13px] shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#180f0a] text-white px-5 py-3 rounded-full shadow-2xl border border-white/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#ffdad3]"></span>
            <span className="text-[13px] font-medium tracking-wide">{toastMessage}</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
