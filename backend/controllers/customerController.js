import Customer from '../models/Customer.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export async function listCustomers(req, res, next) {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    const match = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ],
        }
      : {};
    const customers = await Customer.find(match).sort({ createdAt: -1 }).limit(500);
    res.json({ success: true, customers });
  } catch (err) {
    next(err);
  }
}

export async function getCustomer(req, res, next) {
  try {
    const { id } = req.params;

    // Ownership rule: customers may read their own profile; handler/admin may
    // read any profile. A non-owner never learns a record exists → 404.
    const isStaff = ['admin', 'handler'].includes(req.user.role);
    if (!isStaff && String(req.user.customerId || '') !== id) {
      throw new ApiError(404, 'Customer not found.', 'NOT_FOUND');
    }

    let customer;
    try {
      customer = await Customer.findById(id);
    } catch {
      customer = null;
    }
    if (!customer) {
      throw new ApiError(404, 'Customer not found.', 'NOT_FOUND');
    }
    res.json({ success: true, customer });
  } catch (err) {
    next(err);
  }
}

export async function getMyProfile(req, res, next) {
  try {
    if (req.user.role !== 'customer' || !req.user.customerId) {
      throw new ApiError(404, 'Customer profile not found.', 'NOT_FOUND');
    }
    const customer = await Customer.findById(req.user.customerId);
    if (!customer) {
      throw new ApiError(404, 'Customer profile not found.', 'NOT_FOUND');
    }
    res.json({ success: true, customer });
  } catch (err) {
    next(err);
  }
}

export async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const isStaff = ['admin', 'handler'].includes(req.user.role);
    if (!isStaff && String(req.user.customerId || '') !== id) {
      throw new ApiError(403, 'You can only update your own profile.', 'FORBIDDEN');
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      throw new ApiError(404, 'Customer not found.', 'NOT_FOUND');
    }

    const allowed = ['name', 'phone', 'addresses', 'preferences', 'city', 'state', 'status'];
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        // email changes are deliberately not allowed here (identity field)
        if (field === 'email') continue;
        customer[field] = req.body[field];
      }
    }
    // Only staff can flip Active/Inactive
    if (req.body.status !== undefined && !isStaff) delete req.body.status;

    await customer.save();
    res.json({ success: true, customer });
  } catch (err) {
    next(err);
  }
}
