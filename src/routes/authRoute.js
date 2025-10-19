import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js';
import authMiddleare from '../middleware/authMiddleare.js';

// Login routes 
router.post('/register', authController.register)
router.post('/login', authController.login)

export default router;
