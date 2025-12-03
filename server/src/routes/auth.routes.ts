// server/src/routes/auth.routes.ts
import { Router } from 'express';
import {
  register,
  login,
  me,
  registerValidation,
  loginValidation,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/register
 */
router.post('/register', registerValidation, register);

/**
 * POST /api/auth/login
 */
router.post('/login', loginValidation, login);

/**
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, me);

export default router;
