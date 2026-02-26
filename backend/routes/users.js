const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateUserRole,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', protect, upload.single('avatar'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

module.exports = router;
