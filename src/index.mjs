import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
  check,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Middleware
const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexById = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex; // to passing data
  next();
};
// this middleware will apply all route below in expressJS
// can apply number any middleware
app.use(loggingMiddleware, (req, res, next) => {
  console.log("Finished logging...");
  next();
});

const PORT = process.env.PORT || 3000;

app.get(
  "/",
  (req, res, next) => {
    console.log("Base URL");
    next();
  },
  (req, res) => {
    res.status(201).send({ msg: "Welcome to the Home Page!" });
  }
);

const mockUsers = [
  { id: 1, username: "anson", displayName: "Anson" },
  { id: 2, username: "john", displayName: "John Doe" },
  { id: 3, username: "jane", displayName: "Jane Smith" },
];

// Endpoint to get all users with optional filtering
app.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Must be string")
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (req, res) => {
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
app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
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
});

// Endpoint to get a user by ID
app.get("/api/users/:id", resolveIndexById, (req, res) => {
  console.log(req.params);
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);
  return res.status(200).send(findUser);
});

// Endpoint all products
app.get("/api/products", (req, res) => {
  res.send([
    { id: 123, name: "chicken breast", price: 12.99 },
    { id: 456, name: "broccoli", price: 3.99 },
    { id: 789, name: "rice", price: 1.99 },
    { id: 101, name: "olive oil", price: 5.49 },
    { id: 102, name: "salt", price: 0.99 },
    { id: 103, name: "pepper", price: 1.49 },
    { id: 104, name: "garlic", price: 0.79 },
    { id: 105, name: "onion", price: 0.89 },
    { id: 106, name: "spinach", price: 2.49 },
    { id: 107, name: "tomato", price: 0.99 },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Visit http://localhost:" + PORT);
});

// localhost:3000
// localhost:3000/users
// localhost:3000/products?key=value&key2=value2

// Endpoint to update a user by ID
app.put("/api/users/:id", resolveIndexById, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  console.log(mockUsers);
  return res.status(200).send(mockUsers[findUserIndex]);
});

// PATCH endpoint to partially update a user by ID
app.patch("/api/users/:id", resolveIndexById, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  console.log(mockUsers);
  return res.status(200).send(mockUsers);
});

// DELETE Request
app.delete("/api/users/:id", resolveIndexById, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1); // 1 la so luong phan tu can cat bo
  console.log(mockUsers);
  return res.sendStatus(200);
});
