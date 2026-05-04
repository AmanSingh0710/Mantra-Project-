require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// 🔐 Security packages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const sanitize = require("./middleware/sanitize");
const xssSanitize = require("./middleware/xssSanitize");

connectDB();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// ================= SECURITY MIDDLEWARE ================= //

// ✅ Secure headers
app.use(helmet());

// ✅ Rate limiting (global)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// ✅ Prevent NoSQL injection
app.use(sanitize);

// ✅ Prevent XSS
app.use(xssSanitize);

// ✅ Request size limit
app.use(express.json({ limit: "10kb" }));

// ✅ Logging
app.use(morgan("combined"));

// // ✅ CORS (production ready)
// app.use(cors({
//   origin: ["http://localhost:3000"], // change in production
//   credentials: true
// }));


// ================= ROUTES ================= //

app.use("/auth", require("./routes/authRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/Adminproducts", require("./routes/AdminproductRoutes")); // 🔥 rename
app.use("/cart", require("./routes/cartRoutes"));
app.use("/order", require("./routes/orderRoutes"));
app.use("/stores", require("./routes/storeRoutes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/dashboard", require("./routes/dashboardRoutes"));
app.use("/offers", require("./routes/offerRoutes"));
app.use("/brand", require("./routes/brandRoutes"));
app.use("/category", require("./routes/categoryRoutes"));
app.use("/faq", require("./routes/faqRoutes"));
app.use("/banner", require("./routes/bannerRoutes"));
app.use("/attributes", require("./routes/attributeRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));
app.use("/salesReport", require("./routes/salesRoutes"));
app.use("/report", require("./routes/orderReportRoutes"));
app.use("/review", require("./routes/reviewRoutes"));
app.use("/deliveryman", require("./routes/deliveryManRoutes"));
app.use("/blogs", require("./routes/blogRoutes"));
app.use("/employees", require("./routes/employeeRoutes"));
app.use("/support", require("./routes/Help&Support/supportRoutes"));


// ================= GLOBAL ERROR HANDLER ================= //

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong"
  });
});


// ================= SERVER ================= //

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);