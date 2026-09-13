import CustomRequest from '../models/CustomRequest.js';
import { ApiError } from '../middleware/errorMiddleware.js';

export async function createCustomRequest(req, res, next) {
  try {
    const { description, occasion, budget, colors, desiredDate, imageUrl } = req.body;
    if (!description || description.trim().length < 10) {
      throw new ApiError(422, 'Please describe your custom gift idea in at least 10 characters.');
    }
    const request = await CustomRequest.create({
      customerId: req.user.customerId,
      description: description.trim(),
      occasion: occasion || '',
      budget: budget || '',
      colors: colors || '',
      desiredDate: desiredDate || null,
      imageUrl: imageUrl || '',
      status: 'pending',
    });
    res.status(201).json({ success: true, request });
  } catch (err) {
    next(err);
  }
}

export async function listMyCustomRequests(req, res, next) {
  try {
    // adminNotes are internal staff observations — never shipped to customers.
    const requests = await CustomRequest.find({ customerId: req.user.customerId })
      .select('-adminNotes')
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    next(err);
  }
}

export async function listAllCustomRequests(req, res, next) {
  try {
    const { status } = req.query;
    const match = {};
    if (status && status !== 'All') match.status = status;
    const requests = await CustomRequest.find(match).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, requests });
  } catch (err) {
    next(err);
  }
}

export async function updateCustomRequestStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const validStatuses = ['pending', 'reviewing', 'quoted', 'accepted', 'declined'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(422, 'Invalid status.');
    }
    const update = { status };
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    const request = await CustomRequest.findByIdAndUpdate(id, update, { new: true });
    if (!request) throw new ApiError(404, 'Custom request not found.');
    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
}
