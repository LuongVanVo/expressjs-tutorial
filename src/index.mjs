import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

const app = express();

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

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const findUser = mockUsers.find((user) => user.password === password);

  if (!findUser || findUser.password !== password)
    return res.status(401).send({ msg: "BAD CREDENTIALS" });

  // dùng session để lưu thông tin người dùng đã đăng nhập
  req.session.user = findUser;
  return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "Not Authenticated" });
});

//Simulation cart with session
app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;

  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

app.get('/api/cart', (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  
  return res.send(req.session.cart ?? []);
});