const bcrypt = require('bcryptjs');
const prisma = require('../prisma');

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = {};
    if (role) {
      where.role = role.toUpperCase();
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            updates: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const createUser = async (req, res) => {
  try {
    const { userId, name, password, role } = req.body;

    if (!userId || !name || !password || !role) {
      return res.status(400).json({ error: 'All fields (userId, name, password, role) are required' });
    }

    const normalizedRole = role.toUpperCase().trim();
    if (!['ADMIN', 'TEAM', 'CLIENT'].includes(normalizedRole)) {
      return res.status(400).json({ error: 'Role must be ADMIN, TEAM, or CLIENT' });
    }

    const cleanUserId = userId.trim().toLowerCase();
    if (cleanUserId.length < 3) {
      return res.status(400).json({ error: 'User ID must be at least 3 characters long' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { userId: cleanUserId }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'A user with this User ID already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        userId: cleanUserId,
        name: name.trim(),
        passwordHash,
        role: normalizedRole
      },
      select: {
        id: true,
        userId: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser
};
