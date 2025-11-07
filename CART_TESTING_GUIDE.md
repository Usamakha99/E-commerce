# 🛒 Cart Testing Guide

## ✅ Cart Flow Testing - Complete Setup Done!

### What's Been Implemented:

1. **Dummy Data Mode** - LocalStorage based testing (No backend needed!)
2. **Add to Cart** - Product detail page se cart mein add karo
3. **Cart Icon Badge** - Real-time count update
4. **Cart Page** - View, update, remove items
5. **Quantity Management** - +/- buttons working
6. **Automatic Total Calculation** - Subtotal, Tax, Shipping, Total

---

## 🧪 How to Test:

### Step 1: Add Product to Cart
1. Go to any product detail page: `/product/1` or `/product/2`
2. Select quantity using +/- buttons (default: 1)
3. Click **"Add to Cart"** button
4. You'll see success message: ✅ "X item(s) added to cart successfully!"
5. Page will auto-scroll to top

### Step 2: Check Cart Icon Badge
1. Look at the header (top right)
2. Cart icon 🛒 should now show a **red badge** with item count
3. Badge updates automatically after adding items

### Step 3: View Cart Page
1. Click on the **Cart Icon** in header
2. OR go to `/cart` directly
3. You should see:
   - All added products with images
   - Product name, SKU, price
   - Quantity controls (+/-)
   - Remove button
   - Order summary (Subtotal, Tax, Shipping, Total)

### Step 4: Update Quantity in Cart
1. On cart page, click **+** button to increase quantity
2. Click **-** button to decrease quantity
3. Total amount updates automatically

### Step 5: Remove Items
1. Click **"Remove"** button next to any product
2. Item will be deleted from cart
3. Total recalculates

### Step 6: Proceed to Checkout
1. Click **"Proceed to Checkout"** button
2. (Currently will navigate to `/checkout` - to be implemented)

---

## 🎯 Test Scenarios:

### Scenario 1: Add Multiple Products
```
1. Add Product A (Quantity: 2)
2. Add Product B (Quantity: 1)
3. Add Product A again (Quantity: 1)
Result: Product A should have total 3 quantity
```

### Scenario 2: Empty Cart
```
1. Add some products
2. Remove all items
Result: Should show "Your cart is empty" message
```

### Scenario 3: Cart Persistence
```
1. Add products to cart
2. Refresh page (F5)
3. Check cart icon and cart page
Result: Products should still be there (localStorage)
```

### Scenario 4: Cart Badge Update
```
1. Cart is empty (badge: 0 or hidden)
2. Add 1 product → Badge shows: 1
3. Add another product → Badge shows: 2
4. Remove 1 product → Badge shows: 1
```

---

## 🔧 Technical Details:

### Data Storage:
- **Mode**: `USE_DUMMY_DATA = true` (in cart.service.js)
- **Storage**: Browser localStorage
- **Key**: `vcloud_cart`

### Switch to Real API:
When backend is ready, change in `src/services/cart.service.js`:
```javascript
const USE_DUMMY_DATA = false; // Change to false
```

### Cart Data Structure:
```json
{
  "items": [
    {
      "id": 1234567890,
      "productId": 1,
      "name": "Product Name",
      "price": 2856.3,
      "quantity": 2,
      "image": "image-url",
      "sku": "SKU123"
    }
  ],
  "total": 5712.6
}
```

---

## 🐛 Troubleshooting:

### Cart not updating?
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Check for errors
4. Clear localStorage: `localStorage.clear()`

### Badge not showing?
1. Make sure you added items successfully
2. Check console for errors
3. Refresh page

### Can't see products in cart?
1. Go to DevTools → Application → Local Storage
2. Check `vcloud_cart` key
3. If empty, add products again

---

## 📝 Testing Checklist:

- [ ] Add single product to cart
- [ ] Add multiple products to cart
- [ ] Add same product multiple times (quantity increases)
- [ ] Cart badge shows correct count
- [ ] View cart page shows all products
- [ ] Increase quantity in cart (+)
- [ ] Decrease quantity in cart (-)
- [ ] Remove product from cart
- [ ] Empty cart shows empty message
- [ ] Total amount calculates correctly
- [ ] Cart persists after page refresh
- [ ] Click "Continue Shopping" link
- [ ] Click "Proceed to Checkout" button

---

## 🎉 Success Criteria:

✅ Product adds to cart successfully
✅ Cart badge updates in real-time
✅ Cart page displays all items correctly
✅ Quantity management works
✅ Remove items works
✅ Totals calculate correctly
✅ Cart persists across page refreshes
✅ Empty cart state shows properly

---

## 🚀 Next Steps (Future):

1. Connect to real backend API
2. Implement checkout page
3. Add user authentication
4. Save cart to database
5. Add coupon/discount codes
6. Calculate real shipping costs
7. Payment gateway integration

---

**Happy Testing! 🎊**

