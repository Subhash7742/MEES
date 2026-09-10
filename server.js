const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Products list (Puma style footwear & sportswear)
const products = [
  { id: 1, name: "MEES Nitro Runner Shoes", price: 3999, category: "Shoes" },
  { id: 2, name: "MEES Retro Classic Sneakers", price: 2999, category: "Shoes" },
  { id: 3, name: "MEES Pro Training T-Shirt", price: 1199, category: "Apparel" },
  { id: 4, name: "MEES Street Trackpants", price: 1899, category: "Apparel" }
];

// In-memory orders database (Aapke orders yahan jama honge)
let orders = [];

// 1. User Login Route
app.post('/api/auth/login', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email aur Password zaroori hai!" });
  }
  return res.json({
    success: true,
    user: {
      name: name || email.split('@')[0],
      email: email
    }
  });
});

// 2. Fetch Products Route
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 3. Place Order Route (User se order aane par)
app.post('/api/orders/place', (req, res) => {
  const { user, cartItems, totalAmount, deliveryAddress, phone } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ success: false, message: "Cart khali hai!" });
  }

  const newOrder = {
    orderId: "MEES-" + Math.floor(100000 + Math.random() * 900000),
    customerName: user.name,
    customerEmail: user.email,
    phone: phone,
    deliveryAddress: deliveryAddress,
    items: cartItems,
    totalAmount: totalAmount,
    orderDate: new Date().toLocaleString()
  };

  // Order save ho raha hai
  orders.push(newOrder);

  console.log("Naya Order Received:", newOrder);

  res.status(201).json({
    success: true,
    message: "Order successfully record ho gaya!",
    order: newOrder
  });
});

// 4. Admin/Store Owner Route (Aapko apne sare orders dekhne ke liye)
app.get('/api/admin/orders', (req, res) => {
  res.json({ totalOrders: orders.length, orders: orders });
});

app.listen(PORT, () => {
  console.log(`MEES Server running on http://localhost:${PORT}`);
});
