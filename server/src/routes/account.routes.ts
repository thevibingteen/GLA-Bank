import express from 'express';
import Account from '../models/Account.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all accounts for user
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const accounts = await Account.find({ userId: req.userId, status: { $ne: 'closed' } })
      .sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single account
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create new account
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, type, initialBalance } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    if (!['checking', 'savings', 'credit'].includes(type)) {
      return res.status(400).json({ message: 'Invalid account type' });
    }

    const account = new Account({
      userId: req.userId,
      name,
      type,
      balance: initialBalance || 0,
      status: 'active'
    });

    await account.save();
    res.status(201).json(account);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update account
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, status } = req.body;
    const account = await Account.findOne({ _id: req.params.id, userId: req.userId });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (name) account.name = name;
    if (status) account.status = status;

    await account.save();
    res.json(account);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete/Close account
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, userId: req.userId });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    account.status = 'closed';
    await account.save();
    res.json({ message: 'Account closed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

