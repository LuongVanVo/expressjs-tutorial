import { Router } from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
  check,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middleware.mjs";

const router = Router();

// Endpoint to get all users with optional filtering
router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must be string")
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    })
    
    console.log(req.query); // quey has form key value
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    // when filter and value are undefined
    if (!filter && !value) return res.send(mockUsers);
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    // when filter is defined but value is not
    return res.send(mockUsers);
  }
);

// Endpoint to create a new user
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    console.log(req.body);
    const result = validationResult(req);
    console.log(result);

    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });

    // có thể sử dụng matchedData thay thế cho const { body } thông thường
    const data = matchedData(req);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    console.log(mockUsers);
    return res.status(201).send(newUser);
  }
);

// Endpoint to get a user by ID
router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  console.log(req.params);
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.status(200).send(findUser);
});

// Endpoint to update a user by ID
router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  console.log(mockUsers);
  return res.status(200).send(mockUsers[findUserIndex]);
});

// PATCH endpoint to partially update a user by ID
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  console.log(mockUsers);
  return res.status(200).send(mockUsers);
});

// DELETE Request
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1); // 1 la so luong phan tu can cat bo
  console.log(mockUsers);
  return res.sendStatus(200);
});

router.post("/api/auth", (req, res) => {
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

router.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "Not Authenticated" });
});

//Simulation cart with session
router.post("/api/cart", (req, res) => {
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

router.get('/api/cart', (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});
export default router;
