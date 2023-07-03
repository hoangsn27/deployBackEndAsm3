const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const MONGODB_URI = `mongodb+srv://hoangsn:123456a@cluster0.p6svwef.mongodb.net/e-commerce-website`;

const app = express();
app.use(cors());

// storage file upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// filter format file upload
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/carts");
const orderRoutes = require("./routes/orders");
const historiesRoutes = require("./routes/histories");
const adminRoutes = require("./routes/admin");
const sessionRoutes = require("./routes/session");

app.use(express.urlencoded({ extended: true }));
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).array("images")
);
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/histories", historiesRoutes);
app.use("/admin", adminRoutes);
app.use("/chatrooms", sessionRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const server = app.listen(5000);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      // server receives the "send_message" key submitted by the user
      socket.on("send_message", (data) => {
        // server sends back to client via socket with key "receive_message"
        socket.broadcast.emit("receive_message");
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
