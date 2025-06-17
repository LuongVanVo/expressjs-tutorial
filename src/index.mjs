import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./strategies/local-strategy.mjs";
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected database'))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser("helloworld")); // Middleware to parse cookies, with a secret for signed cookies
app.use(
  session({
    secret: "voluong the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 6 * 1000 * 60, // 1h
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Endpoint to handle user authentication passport 
app.post(
  "/api/auth",
  passport.authenticate("local"),
  (req, res) => {
    res.sendStatus(200);
  }
);

app.get('/api/auth/status', (req, res) => {
  console.log(`Inside /auth/status endpoint. `);
  console.log(req.user);
  console.log(req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/api/auth/logout', (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.send(200);
  });
});

app.use(routes);
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true; // dùng để không tạo session mới mỗi lần truy cập, quản lý session truy cập
  // để có thể dễ dàng theo dõi người dùng với chỉ một id
  res.cookie("hello", "world", { maxAge: 10000, signed: true });
  res.status(201).send({ msg: "Welcome to the Home Page!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Visit http://localhost:" + PORT);
});
