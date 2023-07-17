const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getMyData,
  updateUserData,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users/me', getMyData);

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUserData);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
