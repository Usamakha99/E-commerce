# 🏪 Marketplace Backend - Complete CRUD Structure

## 📋 Overview
Yeh document marketplace ke liye complete backend structure provide karta hai with database schema, API endpoints, aur implementation details.

---

## 🗄️ Database Schema

### 1. **Marketplace Products Table** (`marketplace_products`)

```sql
CREATE TABLE marketplace_products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  provider VARCHAR(255) NOT NULL,
  category_id INT,
  
  -- Images & Media
  logo VARCHAR(500),
  video_thumbnail VARCHAR(500),
  video_url VARCHAR(500),
  gallery JSON, -- Array of image URLs
  
  -- Descriptions
  short_description TEXT,
  long_description TEXT,
  overview TEXT,
  
  -- Pricing
  pricing_type ENUM('free', 'paid', 'freemium', 'trial') DEFAULT 'paid',
  price DECIMAL(10, 2),
  pricing_details JSON, -- Complex pricing structures
  
  -- Reviews & Ratings
  rating DECIMAL(3, 2) DEFAULT 0,
  aws_reviews INT DEFAULT 0,
  external_reviews INT DEFAULT 0,
  total_reviews INT DEFAULT 0,
  
  -- Features & Highlights
  features JSON, -- Array of features
  highlights JSON, -- Array of highlight points
  
  -- Delivery & Deployment
  delivery_methods JSON, -- Array: ['SaaS', 'AMI', 'Container', etc.]
  deployment_type VARCHAR(100),
  
  -- Badges & Tags
  badges JSON, -- ['Deployed on AWS', 'Free Trial', 'AWS Free Tier']
  tags JSON,
  
  -- Status & Visibility
  status ENUM('active', 'inactive', 'draft') DEFAULT 'active',
  free_trial BOOLEAN DEFAULT false,
  aws_free_tier BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES marketplace_categories(id) ON DELETE SET NULL,
  INDEX idx_provider (provider),
  INDEX idx_category (category_id),
  INDEX idx_status (status),
  INDEX idx_rating (rating),
  FULLTEXT idx_search (name, short_description)
);
```

### 2. **Marketplace Categories Table** (`marketplace_categories`)

```sql
CREATE TABLE marketplace_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  product_count INT DEFAULT 0,
  parent_id INT DEFAULT NULL, -- For subcategories
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_id) REFERENCES marketplace_categories(id) ON DELETE SET NULL,
  INDEX idx_parent (parent_id),
  INDEX idx_status (status)
);
```

### 3. **Marketplace Publishers Table** (`marketplace_publishers`)

```sql
CREATE TABLE marketplace_publishers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo VARCHAR(500),
  website_url VARCHAR(500),
  contact_email VARCHAR(255),
  product_count INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_status (status)
);
```

### 4. **Marketplace Reviews Table** (`marketplace_reviews`)

```sql
CREATE TABLE marketplace_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT,
  review_type ENUM('aws', 'external') DEFAULT 'aws',
  helpful_count INT DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT false,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES marketplace_products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id),
  INDEX idx_rating (rating),
  INDEX idx_status (status)
);
```

### 5. **Marketplace Pricing Plans Table** (`marketplace_pricing_plans`)

```sql
CREATE TABLE marketplace_pricing_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  plan_type VARCHAR(100), -- 'Monthly', 'Annual', 'Pay-as-you-go'
  price DECIMAL(10, 2),
  billing_period VARCHAR(50),
  features JSON, -- Array of features included
  is_popular BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES marketplace_products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id)
);
```

---

## 🔌 REST API Endpoints

### **Products Endpoints**

#### 1. Get All Products (with Filters)
```
GET /api/marketplace/products
```

**Query Parameters:**
```javascript
{
  page: 1,
  limit: 20,
  category: "Software Development",
  delivery_method: ["SaaS", "API-Based Agents & Tools"],
  publisher: "Flexa Cloud",
  sort_by: "relevance", // relevance, newest, rating, price_low, price_high
  search: "okta",
  status: "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Okta Platform",
        "slug": "okta-platform",
        "provider": "Okta, Inc",
        "logo": "https://...",
        "rating": 4.5,
        "awsReviews": 1,
        "externalReviews": 999,
        "freeTrial": true,
        "shortDescription": "...",
        "category": {
          "id": 1,
          "name": "Software Development"
        },
        "badges": ["Deployed on AWS", "Free Trial"],
        "deliveryMethods": ["SaaS", "API"],
        "pricing": {
          "type": "freemium",
          "startingPrice": 0
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2073,
      "totalPages": 104
    },
    "filters": {
      "appliedFilters": {
        "category": "Software Development",
        "deliveryMethods": ["SaaS"]
      }
    }
  }
}
```

#### 2. Get Single Product
```
GET /api/marketplace/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Okta Platform",
    "slug": "okta-platform",
    "provider": "Okta, Inc",
    "logo": "https://...",
    "videoThumbnail": "https://...",
    "videoUrl": "https://...",
    "gallery": ["url1", "url2"],
    "rating": 4.5,
    "awsReviews": 1,
    "externalReviews": 999,
    "totalReviews": 1000,
    "shortDescription": "...",
    "longDescription": "...",
    "overview": "...",
    "highlights": ["point 1", "point 2"],
    "features": ["feature 1", "feature 2"],
    "badges": ["Deployed on AWS", "Free Trial"],
    "deliveryMethods": ["SaaS"],
    "freeTrial": true,
    "awsFreeTier": false,
    "category": {
      "id": 1,
      "name": "Software Development"
    },
    "pricingPlans": [
      {
        "id": 1,
        "planName": "Basic",
        "price": 0,
        "billingPeriod": "monthly",
        "features": ["Feature 1", "Feature 2"]
      }
    ],
    "breadcrumbs": [
      {"name": "Marketplace", "url": "/marketplace"},
      {"name": "Software Development", "url": "/marketplace?category=1"},
      {"name": "Okta Platform", "url": "#"}
    ],
    "relatedProducts": [],
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-15"
  }
}
```

#### 3. Create Product
```
POST /api/marketplace/products
```

**Request Body:**
```json
{
  "name": "Product Name",
  "provider": "Company Name",
  "categoryId": 1,
  "logo": "https://...",
  "shortDescription": "Short description",
  "longDescription": "Long description",
  "overview": "Overview text",
  "pricingType": "freemium",
  "price": 0,
  "features": ["feature1", "feature2"],
  "highlights": ["highlight1", "highlight2"],
  "deliveryMethods": ["SaaS"],
  "badges": ["Free Trial"],
  "freeTrial": true,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 123,
    "name": "Product Name",
    "slug": "product-name"
  }
}
```

#### 4. Update Product
```
PUT /api/marketplace/products/:id
```

**Request Body:** (Same as Create, all fields optional)

#### 5. Delete Product
```
DELETE /api/marketplace/products/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### **Categories Endpoints**

#### 1. Get All Categories
```
GET /api/marketplace/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Software Development",
      "slug": "software-development",
      "productCount": 602,
      "icon": "icon-url",
      "subcategories": []
    }
  ]
}
```

#### 2. Create Category
```
POST /api/marketplace/categories
```

#### 3. Update Category
```
PUT /api/marketplace/categories/:id
```

#### 4. Delete Category
```
DELETE /api/marketplace/categories/:id
```

---

### **Publishers Endpoints**

#### 1. Get All Publishers
```
GET /api/marketplace/publishers
```

#### 2. Get Publisher Details
```
GET /api/marketplace/publishers/:id
```

#### 3. Create Publisher
```
POST /api/marketplace/publishers
```

#### 4. Update Publisher
```
PUT /api/marketplace/publishers/:id
```

#### 5. Delete Publisher
```
DELETE /api/marketplace/publishers/:id
```

---

### **Reviews Endpoints**

#### 1. Get Product Reviews
```
GET /api/marketplace/products/:productId/reviews
```

#### 2. Create Review
```
POST /api/marketplace/products/:productId/reviews
```

#### 3. Update Review
```
PUT /api/marketplace/reviews/:id
```

#### 4. Delete Review
```
DELETE /api/marketplace/reviews/:id
```

---

### **Filters & Aggregations**

#### 1. Get Available Filters
```
GET /api/marketplace/filters
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {"id": 1, "name": "Software Development", "count": 602}
    ],
    "deliveryMethods": [
      {"name": "SaaS", "count": 662},
      {"name": "Professional Services", "count": 1137}
    ],
    "publishers": [
      {"id": 1, "name": "Flexa Cloud", "count": 297}
    ],
    "priceRanges": [
      {"range": "Free", "count": 450},
      {"range": "$0-$50", "count": 320}
    ]
  }
}
```

---

## 📁 Backend File Structure

```
backend/
├── config/
│   ├── database.js          # Database connection
│   ├── config.js            # App configuration
│   └── multer.js            # File upload config
│
├── models/
│   ├── MarketplaceProduct.js
│   ├── MarketplaceCategory.js
│   ├── MarketplacePublisher.js
│   ├── MarketplaceReview.js
│   └── MarketplacePricingPlan.js
│
├── controllers/
│   ├── marketplaceProductController.js
│   ├── marketplaceCategoryController.js
│   ├── marketplacePublisherController.js
│   ├── marketplaceReviewController.js
│   └── marketplaceFilterController.js
│
├── routes/
│   ├── marketplaceProduct.routes.js
│   ├── marketplaceCategory.routes.js
│   ├── marketplacePublisher.routes.js
│   └── marketplaceReview.routes.js
│
├── middlewares/
│   ├── auth.middleware.js    # Authentication
│   ├── validate.middleware.js # Input validation
│   └── upload.middleware.js   # File upload handling
│
├── validators/
│   ├── marketplaceProduct.validator.js
│   ├── marketplaceCategory.validator.js
│   └── marketplaceReview.validator.js
│
├── services/
│   ├── marketplaceProduct.service.js
│   ├── marketplaceSearch.service.js
│   └── marketplaceFilter.service.js
│
├── utils/
│   ├── slugify.js           # Generate slugs
│   ├── pagination.js        # Pagination helper
│   └── imageUpload.js       # Image processing
│
└── app.js                    # Main app file
```

---

## 🔨 Implementation Examples

### **1. Product Controller (marketplaceProductController.js)**

```javascript
const MarketplaceProduct = require('../models/MarketplaceProduct');
const { paginate } = require('../utils/pagination');

// Get all products with filters
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      delivery_method,
      publisher,
      sort_by = 'relevance',
      search,
      status = 'active'
    } = req.query;

    // Build query
    let query = { status };

    // Category filter
    if (category) {
      query.category_id = category;
    }

    // Delivery method filter
    if (delivery_method) {
      const methods = Array.isArray(delivery_method) ? delivery_method : [delivery_method];
      query.delivery_methods = { $in: methods };
    }

    // Publisher filter
    if (publisher) {
      query.provider = publisher;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    switch (sort_by) {
      case 'newest':
        sort = { created_at: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'price_low':
        sort = { price: 1 };
        break;
      case 'price_high':
        sort = { price: -1 };
        break;
      default:
        sort = { rating: -1, aws_reviews: -1 };
    }

    // Execute query with pagination
    const result = await paginate(MarketplaceProduct, query, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: ['category']
    });

    res.json({
      success: true,
      data: {
        products: result.docs,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.pages
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await MarketplaceProduct.findById(id)
      .populate('category')
      .populate('pricing_plans');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Generate slug
    productData.slug = slugify(productData.name);

    // Handle file uploads if any
    if (req.files) {
      if (req.files.logo) productData.logo = req.files.logo[0].path;
      if (req.files.gallery) {
        productData.gallery = req.files.gallery.map(file => file.path);
      }
    }

    const product = await MarketplaceProduct.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle file uploads
    if (req.files) {
      if (req.files.logo) updateData.logo = req.files.logo[0].path;
      if (req.files.gallery) {
        updateData.gallery = req.files.gallery.map(file => file.path);
      }
    }

    const product = await MarketplaceProduct.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await MarketplaceProduct.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};
```

### **2. Product Routes (marketplaceProduct.routes.js)**

```javascript
const express = require('express');
const router = express.Router();
const marketplaceProductController = require('../controllers/marketplaceProductController');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validateProduct } = require('../validators/marketplaceProduct.validator');
const upload = require('../middlewares/upload.middleware');

// Public routes
router.get('/', marketplaceProductController.getAllProducts);
router.get('/:id', marketplaceProductController.getProduct);

// Protected routes (Admin only)
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  validateProduct,
  marketplaceProductController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  validateProduct,
  marketplaceProductController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  marketplaceProductController.deleteProduct
);

module.exports = router;
```

### **3. Product Validator**

```javascript
const { body } = require('express-validator');

exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),
  
  body('provider')
    .trim()
    .notEmpty()
    .withMessage('Provider is required'),
  
  body('categoryId')
    .optional()
    .isInt()
    .withMessage('Invalid category ID'),
  
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ max: 500 })
    .withMessage('Short description must be less than 500 characters'),
  
  body('pricingType')
    .optional()
    .isIn(['free', 'paid', 'freemium', 'trial'])
    .withMessage('Invalid pricing type'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('deliveryMethods')
    .optional()
    .isArray()
    .withMessage('Delivery methods must be an array'),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'draft'])
    .withMessage('Invalid status')
];
```

---

## 🧪 Testing with Postman

### Collection Export:
```json
{
  "info": {
    "name": "Marketplace API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/marketplace/products?page=1&limit=20"
          }
        },
        {
          "name": "Get Single Product",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/marketplace/products/:id"
          }
        },
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/marketplace/products",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test Product\",\n  \"provider\": \"Test Company\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📊 Sample Data Seeds

```sql
-- Categories
INSERT INTO marketplace_categories (name, slug, product_count) VALUES
('Software Development', 'software-development', 602),
('Data Analysis', 'data-analysis', 447),
('AI Security', 'ai-security', 178);

-- Products
INSERT INTO marketplace_products (
  name, slug, provider, category_id, logo, rating, 
  aws_reviews, external_reviews, free_trial, short_description,
  delivery_methods, badges, status
) VALUES
('Okta Platform', 'okta-platform', 'Okta, Inc', 1, 
 '/uploads/okta-logo.png', 4.5, 1, 999, true,
 'Secure your employees, contractors, and partners - wherever they are.',
 '["SaaS", "API"]', '["Deployed on AWS", "Free Trial"]', 'active');
```

---

## 🚀 Deployment Checklist

- [ ] Database tables created
- [ ] Indexes added for performance
- [ ] API endpoints implemented
- [ ] Input validation added
- [ ] Authentication & authorization working
- [ ] File upload configured
- [ ] Error handling implemented
- [ ] API documentation created
- [ ] Testing completed
- [ ] Deployment ready

---

## 📚 Additional Features (Future)

1. **Search & Autocomplete**
2. **Product Comparison**
3. **Favorites/Wishlist**
4. **Email Notifications**
5. **Analytics Dashboard**
6. **Bulk Import/Export**
7. **API Rate Limiting**
8. **Caching with Redis**

---

**Created: 2024**
**Version: 1.0**

