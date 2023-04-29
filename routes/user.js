const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateUserAvatarById,
} = require('../controllers/user');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateUserAvatarById);

module.exports = router;
