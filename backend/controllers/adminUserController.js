import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { ApiError } from '../middleware/errorMiddleware.js';
import { escapeRegExp, safeString } from '../utils/querySafety.js';

/**
 * Admin Operator Management — real backend-backed user CRUD.
 *
 * Only admins can manage operators. Handlers are read-only.
 * Password hashes are NEVER exposed.
 */

export async function listOperators(req, res, next) {
  try {
    const { role, status } = req.query;
    const q = safeString(req.query.q, 200);
    const match = { role: { $in: ['admin', 'handler'] } };
    if (role && role !== 'ALL') {
      match.role = role === 'ADMINISTRATOR' ? 'admin' : 'handler';
    }
    if (q) {
      const regex = new RegExp(escapeRegExp(q), 'i');
      match.$or = [{ name: regex }, { email: regex }];
    }
    const users = await User.find(match)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(200);
    // Map to the frontend shape
    const operators = users.map((u) => ({
      id: u._id.toString(),
      name: u.name || u.email.split('@')[0],
      initials: (u.name || u.email)
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      title: u.role === 'admin' ? 'Administrator' : 'Handler',
      role: u.role === 'admin' ? 'ADMINISTRATOR' : 'HANDLER',
      email: u.email,
      status: u.status || 'ACTIVE',
      lastActivity: u.updatedAt
        ? formatRelativeTime(u.updatedAt)
        : 'Unknown',
      isFixture: !!u.isFixture,
      createdAt: u.createdAt,
    }));
    res.json({ success: true, operators });
  } catch (err) {
    next(err);
  }
}

export async function createOperator(req, res, next) {
  try {
    const { name, email, role, password } = req.body;
    if (!name || !email) {
      throw new ApiError(422, 'Name and email are required.', 'VALIDATION_ERROR');
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ApiError(409, 'A user with this email already exists.', 'DUPLICATE');
    }
    const userRole = role === 'ADMINISTRATOR' ? 'admin' : 'handler';
    // Generate a temporary password if none provided
    const rawPassword = password || generateTempPassword();
    const passwordHash = await bcrypt.hash(rawPassword, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: userRole,
      name: name.trim(),
      isFixture: false,
    });
    const operator = {
      id: user._id.toString(),
      name: user.name,
      initials: user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      title: userRole === 'admin' ? 'Administrator' : 'Handler',
      role: userRole === 'admin' ? 'ADMINISTRATOR' : 'HANDLER',
      email: user.email,
      status: 'ACTIVE',
      lastActivity: 'Just now',
      isFixture: false,
      createdAt: user.createdAt,
    };
    res.status(201).json({
      success: true,
      operator,
      // Only return temp password in creation response (never stored in list)
      tempPassword: password ? undefined : rawPassword,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/users/:id/status — suspend or reactivate an operator.
 *
 * Suspension is enforced server-side: login rejects suspended accounts and
 * every protected request re-checks status from the database, so an existing
 * token stops working immediately.
 */
export async function updateOperatorStatus(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'Operator not found.', 'NOT_FOUND');
    }
    if (user._id.toString() === req.user._id.toString()) {
      throw new ApiError(422, 'You cannot change your own account status.', 'VALIDATION_ERROR');
    }
    const { status } = req.body || {};
    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      throw new ApiError(422, 'Status must be ACTIVE or SUSPENDED.', 'VALIDATION_ERROR');
    }
    // Guard: never disable the last active administrator.
    if (user.role === 'admin' && status === 'SUSPENDED') {
      const activeAdmins = await User.countDocuments({ role: 'admin', status: 'ACTIVE' });
      if (activeAdmins <= 1) {
        throw new ApiError(422, 'Cannot suspend the last active administrator.', 'VALIDATION_ERROR');
      }
    }
    user.status = status;
    user.statusChangedAt = new Date();
    await user.save();
    res.json({
      success: true,
      operator: {
        id: user._id.toString(),
        name: user.name,
        status: user.status,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOperatorRole(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'Operator not found.', 'NOT_FOUND');
    }
    if (user._id.toString() === req.user._id.toString()) {
      throw new ApiError(422, 'Cannot change your own role.', 'VALIDATION_ERROR');
    }
    const { role } = req.body;
    if (!['admin', 'handler'].includes(role)) {
      throw new ApiError(422, 'Role must be admin or handler.', 'VALIDATION_ERROR');
    }
    // Guard: demoting the last active admin would lock out administration.
    if (user.role === 'admin' && role !== 'admin') {
      const activeAdmins = await User.countDocuments({ role: 'admin', status: 'ACTIVE' });
      if (activeAdmins <= 1) {
        throw new ApiError(422, 'Cannot demote the last active administrator.', 'VALIDATION_ERROR');
      }
    }
    user.role = role;
    await user.save();
    res.json({
      success: true,
      operator: {
        id: user._id.toString(),
        name: user.name,
        role: user.role === 'admin' ? 'ADMINISTRATOR' : 'HANDLER',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteOperator(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, 'Operator not found.', 'NOT_FOUND');
    }
    if (user._id.toString() === req.user._id.toString()) {
      throw new ApiError(422, 'Cannot delete your own account.', 'VALIDATION_ERROR');
    }
    if (user.isFixture) {
      throw new ApiError(422, 'Cannot delete seed fixture accounts.', 'VALIDATION_ERROR');
    }
    await user.deleteOne();
    res.json({ success: true, message: `Removed operator "${user.name}".` });
  } catch (err) {
    next(err);
  }
}

function generateTempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pass = '';
  for (let i = 0; i < 12; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN');
}
