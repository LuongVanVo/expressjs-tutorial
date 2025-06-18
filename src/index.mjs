import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";

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
    // true: Tạo session mới ngay khi người dùng truy cập, ngay cả khi session chưa có dữ liệu
    // false: Chỉ tạo session khi thực sự có dữ liệu cần lưu vào session
    // để có thể dễ dàng theo dõi người dùng với chỉ một id
    // dùng để lưu trữ session vào MongoDB
    // nếu không dùng MongoDB thì sẽ lưu trữ session vào bộ nhớ tạm thời của server
    // dẫn đến mất session khi server bị tắt
    saveUninitialized: true,
    // true: lưu session vào MongoDB ngay cả khi không có dữ liệu gì
    // false: Chỉ lưu lại session khi có thay đổi
    resave: false,
    cookie: {
      maxAge: 6 * 1000 * 60, // 1h
    },
    // dùng để lưu trữ session vào MongoDB
    // sử dụng connect-mongo để lưu trữ session vào MongoDB
    // để có thể sử dụng session trên nhiều server khác nhau
    // tránh mất session khi server bị tắt
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    })
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
  console.log(req.sessionID);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/api/auth/logout', (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.send(200);
  });
});

// discord
app.get('/api/auth/discord', passport.authenticate('discord'));
app.get('/api/auth/discord/redirect', passport.authenticate("discord"), (req, res) => {
  console.log(req.session);
  console.log(req.user);
  res.sendStatus(200);
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
