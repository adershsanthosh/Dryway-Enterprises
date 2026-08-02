import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';
import { initialProducts } from '../data/products.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to attach fallback IDs and sample reviews/Q&A to static dataset
let dynamicProducts = initialProducts.map((p, idx) => ({
  _id: `dryway-${idx + 101}`,
  offerPrice: p.offerPrice || Math.round(p.price * 0.85),
  isOffer: p.isOffer || (idx % 3 === 0),
  offerTag: p.offerTag || (idx % 3 === 0 ? '15% OFF' : ''),
  reviews: [
    {
      _id: `rev-101-${idx}`,
      name: 'Anjali R.',
      rating: 5,
      comment: 'Super crisp, full of natural taste and no artificial sugar! Reordering again.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      _id: `rev-102-${idx}`,
      name: 'Kiran Kumar',
      rating: 4,
      comment: 'Extremely fresh packaging and very convenient for quick healthy snacking.',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
  ],
  questions: [
    {
      _id: `q-101-${idx}`,
      name: 'Siddharth M.',
      question: 'Is this 100% natural without added preservatives?',
      answer: 'Yes! All Dryway products are 100% natural, dehydrated without artificial chemicals or preservatives.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ],
  rating: 4.8,
  numReviews: 2,
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

// @desc    Create new product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = dynamicProducts.find((p) => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      _id: `rev_${Date.now()}`,
      name: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    if (!product.reviews) product.reviews = [];
    product.reviews.unshift(review);
    product.numReviews = product.reviews.length;
    product.rating = (
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length
    ).toFixed(1);

    return res.status(201).json({ message: 'Review added successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new product question
// @route   POST /api/products/:id/questions
// @access  Public
router.post('/:id/questions', async (req, res) => {
  const { name, question } = req.body;

  try {
    const product = dynamicProducts.find((p) => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const qItem = {
      _id: `q_${Date.now()}`,
      name: name || 'Customer',
      question,
      answer: 'Thank you for your question! Dryway support will update this answer shortly.',
      createdAt: new Date().toISOString(),
    };

    if (!product.questions) product.questions = [];
    product.questions.unshift(qItem);

    return res.status(201).json({ message: 'Question submitted successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
