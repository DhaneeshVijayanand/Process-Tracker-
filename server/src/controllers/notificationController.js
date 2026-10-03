const prisma = require('../prisma');

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false }
    });

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.body;

    if (id) {
      await prisma.notification.updateMany({
        where: { id, userId: req.user.id },
        data: { isRead: true }
      });
    } else {
      await prisma.notification.updateMany({
        where: { userId: req.user.id },
        data: { isRead: true }
      });
    }

    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to update notification status' });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    await prisma.notification.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  clearAllNotifications
};
