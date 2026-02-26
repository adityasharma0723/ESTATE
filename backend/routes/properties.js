const express = require('express');
const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    approveProperty,
    getMyListings,
    getRecommended,
    getAllPropertiesAdmin,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public
router.get('/', getProperties);

// Protected — order matters (static routes before :id)
router.get('/my-listings', protect, authorize('agent', 'admin'), getMyListings);
router.get('/recommended', protect, getRecommended);
router.get('/admin/all', protect, authorize('admin'), getAllPropertiesAdmin);

router.get('/:id', getProperty);

router.post(
    '/',
    protect,
    authorize('agent', 'admin'),
    upload.array('images', 10),
    createProperty
);

router.put(
    '/:id',
    protect,
    authorize('agent', 'admin'),
    upload.array('images', 10),
    updateProperty
);

router.delete('/:id', protect, authorize('agent', 'admin'), deleteProperty);
router.put('/:id/approve', protect, authorize('admin'), approveProperty);

module.exports = router;
