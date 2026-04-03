# Flutter Dashboard - Backend API Integration Guide

## Overview
This guide explains how to integrate the Flutter Web Admin Dashboard with the updated Shop API backend. The backend now has separate collections for Admins and Users, full CRUD for Categories, and proper product-category relationships.

---

## Database Structure (7 Collections)

| Collection | Purpose | Important Note |
|-----------|---------|----------------|
| **admins** | Admins only | Single account: hamza@hamza.com |
| **users** | Customers only | No admins here |
| **categories** | Product categories | 8 default categories |
| **products** | Products | Linked to categories via ObjectId |
| **orders** | Orders | Linked to users & products |
| **carts** | Shopping carts | Temporary per customer |
| **coupons** | Discount coupons | Optional |

---

## Authentication System

### Login (Unified for both Admin and Customers)
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "hamza@hamza.com",
  "password": "hamza9090"
}
```

### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65abc...",
    "email": "hamza@hamza.com",
    "name": "المشرف",
    "role": "admin",
    "type": "admin"
  }
}
```

**CRITICAL:** Check `user.type` to determine dashboard access:
- `admin` or `superadmin` → Redirect to Dashboard
- `customer` → Redirect to Customer Store

### Register (Customers Only)
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "password": "password123"
}
```

---

## Required Headers for All Admin Requests
```dart
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
}
```

---

## API Endpoints for Admin Dashboard

### 1. Categories (CRUD - NEW)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/admin/categories` | List all categories | - |
| GET | `/api/admin/categories/:id` | Get single category | - |
| POST | `/api/admin/categories` | Create category | `{name, description, icon, sortOrder}` |
| PUT | `/api/admin/categories/:id` | Update category | `{name, description, icon, sortOrder}` |
| DELETE | `/api/admin/categories/:id` | Delete category | - |

**POST/PUT Body Example:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "icon": "laptop",
  "sortOrder": 1
}
```

**IMPORTANT:** Delete returns 400 error if category has products.

---

### 2. Products (Updated with Category Selection)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/products` | List all products (includes category data) |
| POST | `/api/admin/products` | Create product (requires category ObjectId) |
| PUT | `/api/admin/products/:id` | Update product (supports changing category) |
| DELETE | `/api/admin/products/:id` | Delete product |

**POST/PUT Body Example:**
```json
{
  "title": "iPhone 15 Pro",
  "description": "Latest iPhone with pro camera",
  "price": 4599.99,
  "stock": 25,
  "category": "65abc123...",  // REQUIRED! Category ObjectId
  "imageUrls": [],
  "variations": [
    {
      "color": "Black",
      "size": "256GB",
      "stock": 10,
      "price": 4599.99
    },
    {
      "color": "White",
      "size": "512GB",
      "stock": 8,
      "price": 5099.99
    }
  ],
  "details": [
    { "key": "Processor", "value": "A17 Pro" },
    { "key": "Screen", "value": "6.1 inch OLED" }
  ]
}
```

**NOTE:** The `category` field must be a valid MongoDB ObjectId from the categories collection.

---

### 3. Orders

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/admin/orders` | List all orders | - |
| GET | `/api/admin/orders/:id` | Get order details | - |
| PATCH | `/api/admin/orders/:id` | Update order status | `{ "status": "completed" }` |

**Status Options:** `pending`, `processing`, `completed`, `cancelled`

---

### 4. Users (Customers)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List all customers | - |
| PATCH | `/api/admin/users/:id/ban` | Ban/Unban customer | `{ "ban": true }` or `{ "ban": false }` |

---

### 5. Admin Settings (NEW)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| PUT | `/api/admin/change-password` | Change admin password | `{ "currentPassword": "...", "newPassword": "..." }` |

---

### 6. Coupons & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/api/admin/coupons` | Full coupon CRUD |
| GET | `/api/admin/analytics` | Dashboard statistics |
| GET/PUT | `/api/admin/settings` | Store settings |

---

## Public API Endpoints (No Token Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Public product list |
| GET | `/api/products/:id` | Public product details |
| GET | `/api/categories` | Active categories for customers |

---

## Data Models (JSON Structure)

### Product with Category
```json
{
  "id": "65abc...",
  "title": "iPhone 15 Pro",
  "description": "Latest iPhone...",
  "price": 4599.99,
  "stock": 25,
  "category": {
    "id": "65xyz...",
    "name": "Electronics",
    "icon": "laptop"
  },
  "imageUrls": [],
  "variations": [
    {
      "_id": "var1...",
      "color": "Black",
      "size": "256GB",
      "stock": 10,
      "price": 4599.99
    }
  ],
  "details": [
    { "key": "Processor", "value": "A17 Pro" }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Category
```json
{
  "id": "65xyz...",
  "name": "Electronics",
  "description": "Electronic devices",
  "icon": "laptop",
  "sortOrder": 1,
  "isActive": true,
  "parentCategory": null,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Order
```json
{
  "id": "65order...",
  "user": {
    "id": "65user...",
    "name": "Ahmed",
    "email": "ahmed@test.com"
  },
  "items": [
    {
      "productId": "65abc...",
      "quantity": 2,
      "priceAtPurchase": 149.99
    }
  ],
  "total": 299.98,
  "status": "pending",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

## Default Categories (8)

1. **Electronics** - Electronic devices and mobile phones
2. **Clothing** - Men's, women's, and children's clothing
3. **Accessories** - Accessories, watches, and jewelry
4. **Home & Garden** - Furniture, decor, and home tools
5. **Sports** - Sports equipment and activewear
6. **Health & Beauty** - Cosmetics and health products
7. **Books** - Books, stationery, and libraries
8. **Toys** - Children's toys and gifts

---

## Error Handling Guide

| HTTP Code | Meaning | Solution |
|-----------|---------|----------|
| 401 | Invalid/expired token | Re-login |
| 403 | Not an admin | Check user.type from login |
| 400 | Missing/invalid data | Validate all required fields |
| 400 (on DELETE category) | Category has products | Move products first |
| 404 | Item not found | Verify the ID format |
| 500 | Server error | Check server logs |

---

## Flutter Dashboard UI Requirements

### 1. Login Screen
- Email & password fields
- Check `user.type` from response
- Store token in secure storage
- Navigate to Dashboard if `type == "admin"`

### 2. Dashboard Sidebar Navigation
- **Dashboard** (Analytics overview)
- **Products** (List, Add, Edit, Delete)
- **Categories** (List, Add, Edit, Delete)
- **Orders** (List, View details, Update status)
- **Customers** (List, Ban/Unban)
- **Settings** (Change password, Store settings)

### 3. Products Management Screen
**Required Form Fields:**
- Title (text)
- Description (text/multiline)
- Price (number)
- Stock (number)
- **Category Dropdown** (fetch from `/api/admin/categories`)
- Image URLs (list of strings)
- **Variations** (dynamic list: color, size, stock, price)
- **Details** (dynamic key-value pairs)

**Flow:**
1. Load categories dropdown first
2. User selects category (store ObjectId)
3. Submit with category ObjectId

### 4. Categories Management Screen
**Table/List showing:**
- Name
- Description
- Icon
- Sort Order
- Status (Active/Inactive)
- Actions (Edit, Delete)

**Delete Confirmation:** Warn if category has products.

### 5. Orders Management Screen
**Table showing:**
- Order ID
- Customer name
- Total amount
- Status (with color indicator)
- Date
- Actions (View, Update status)

### 6. Customers Management Screen
**Table showing:**
- Name
- Email
- Status (Active/Banned)
- Actions (Ban/Unban toggle)

---

## CORS Configuration
Backend accepts requests from ALL origins. Works directly with Flutter Web without CORS issues.

---

## Backend Base URL
```
https://your-render-url.onrender.com
```

---

## Testing Credentials
- **Email:** hamza@hamza.com
- **Password:** hamza9090

---

## Important Implementation Notes

1. **Always send Authorization header** with "Bearer TOKEN" format
2. **Category ObjectId is required** when creating/updating products
3. **Fetch categories first** before showing product form
4. **Variations are optional** but recommended (color, size, stock, price)
5. **Details are optional** key-value pairs for additional specs
6. **ImageUrls is an array** of strings (URLs)
7. **Check 400 error** when deleting categories (may have products)
8. **Use ObjectId** from MongoDB for all ID references

---

## Example Flutter API Service Structure

```dart
class ApiService {
  static const String baseUrl = 'https://your-render-url.onrender.com';
  static String? token;
  
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  };
  
  // Categories
  static Future<List<Category>> getCategories() async {...}
  static Future<Category> createCategory(Category cat) async {...}
  static Future<Category> updateCategory(String id, Category cat) async {...}
  static Future<void> deleteCategory(String id) async {...}
  
  // Products
  static Future<List<Product>> getProducts() async {...}
  static Future<Product> createProduct(Product product) async {...}
  // ... etc
}
```

---

## Contact
For backend issues or questions, refer to the backend documentation or contact the backend developer.
