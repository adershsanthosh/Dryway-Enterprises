import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';
import { initialProducts } from '../data/products.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to attach fallback IDs to static dataset
let dynamicProducts = initialProducts.map((p, idx) => ({
  _id: `dryway-${idx + 101}`,
  offerPrice: p.offerPrice || Math.round(p.price * 0.85),
  isOffer: p.isOffer || (idx % 3 === 0),
  offerTag: p.offerTag || (idx % 3 === 0 ? '15% OFF' : ''),
  ...p,
}));

// Middleware: Allow Admin or Workers with permission to access
const protectAdminOrWorker = (permissionKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (req.user.isAdmin) {
      return next();
    }
    if (req.user.isWorker && req.user.permissions && req.user.permissions[permissionKey]) {
      return next();
    }
    return res.status(403).json({ message: 'Not authorized for this operation' });
  };
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const products = await Product.find({});
      if (products && products.length > 0) {
        return res.json(products);
      }
    }
    return res.json(dynamicProducts);
  } catch (error) {
    return res.json(dynamicProducts);
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findById(req.params.id);
      if (product) {
        return res.json(product);
      }
    }
  } catch (error) {
    // Check in dynamic memory
  }

  const staticProduct = dynamicProducts.find((p) => p._id === req.params.id);

  if (staticProduct) {
    return res.json(staticProduct);
  }

  return res.status(404).json({ message: 'Product not found' });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin or Worker with permission
router.post('/', protect, protectAdminOrWorker('canManageInventory'), async (req, res) => {
  const { title, price, offerPrice, isOffer, offerTag, description, images, category, countInStock } =
    req.body;

  try {
    if (isDbConnected()) {
      const product = new Product({
        title: title || 'New Product',
        price: price || 0,
        offerPrice: offerPrice || 0,
        isOffer: isOffer || false,
        offerTag: offerTag || '',
        user: req.user._id,
        images:
          images && images.length
            ? images
            : [
                'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
              ],
        category: category || 'Healthy Snacks & Dry Fruits',
        countInStock: countInStock || 0,
        description: description || 'Natural dehydrated product',
      });

      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    } else {
      const newProduct = {
        _id: `dryway-${Date.now()}`,
        title: title || 'New Product',
        price: Number(price) || 0,
        offerPrice: Number(offerPrice) || 0,
        isOffer: Boolean(isOffer),
        offerTag: offerTag || '',
        category: category || 'Healthy Snacks & Dry Fruits',
        countInStock: Number(countInStock) || 0,
        description: description || 'Natural dehydrated product',
        images: images && images.length ? images : ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80'],
      };
      dynamicProducts.unshift(newProduct);
      return res.status(201).json(newProduct);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin or Worker with permission
router.put('/:id', protect, protectAdminOrWorker('canEditPrices'), async (req, res) => {
  const { title, price, offerPrice, isOffer, offerTag, description, images, category, countInStock } =
    req.body;

  try {
    if (isDbConnected()) {
      const product = await Product.findById(req.params.id);

      if (product) {
        product.title = title !== undefined ? title : product.title;
        product.price = price !== undefined ? price : product.price;
        product.offerPrice = offerPrice !== undefined ? offerPrice : product.offerPrice;
        product.isOffer = isOffer !== undefined ? isOffer : product.isOffer;
        product.offerTag = offerTag !== undefined ? offerTag : product.offerTag;
        product.description = description !== undefined ? description : product.description;
        product.images = images !== undefined ? images : product.images;
        product.category = category !== undefined ? category : product.category;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

        const updatedProduct = await product.save();
        return res.json(updatedProduct);
      }
    } else {
      const index = dynamicProducts.findIndex((p) => p._id === req.params.id);
      if (index !== -1) {
        dynamicProducts[index] = {
          ...dynamicProducts[index],
          title: title !== undefined ? title : dynamicProducts[index].title,
          price: price !== undefined ? Number(price) : dynamicProducts[index].price,
          offerPrice: offerPrice !== undefined ? Number(offerPrice) : dynamicProducts[index].offerPrice,
          isOffer: isOffer !== undefined ? Boolean(isOffer) : dynamicProducts[index].isOffer,
          offerTag: offerTag !== undefined ? offerTag : dynamicProducts[index].offerTag,
          description: description !== undefined ? description : dynamicProducts[index].description,
          images: images !== undefined ? images : dynamicProducts[index].images,
          category: category !== undefined ? category : dynamicProducts[index].category,
          countInStock: countInStock !== undefined ? Number(countInStock) : dynamicProducts[index].countInStock,
        };
        return res.json(dynamicProducts[index]);
      }
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findById(req.params.id);
      if (product) {
        await product.deleteOne();
        return res.json({ message: 'Product removed' });
      }
    } else {
      dynamicProducts = dynamicProducts.filter((p) => p._id !== req.params.id);
      return res.json({ message: 'Product removed' });
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
