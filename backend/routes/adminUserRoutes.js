import { Router } from 'express';
import {
  listOperators,
  createOperator,
  updateOperatorRole,
  deleteOperator,
} from '../controllers/adminUserController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// All admin user management routes require admin role.
router.use(protect, requireRole('admin'));

router.get('/', listOperators);
router.post('/', createOperator);
router.patch('/:id/role', updateOperatorRole);
router.delete('/:id', deleteOperator);

export default router;
