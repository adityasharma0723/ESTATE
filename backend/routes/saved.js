const express = require('express');
const {
    getSavedProperties,
    saveProperty,
    unsaveProperty,
    checkSaved,
} = require('../controllers/savedController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getSavedProperties);
router.get('/check/:propertyId', protect, checkSaved);
router.post('/:propertyId', protect, saveProperty);
router.delete('/:propertyId', protect, unsaveProperty);

module.exports = router;
