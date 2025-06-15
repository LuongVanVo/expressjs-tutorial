import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser("helloworld")); // Middleware to parse cookies, with a secret for signed cookies
app.use(routes); 

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.cookie('hello', 'world', { maxAge: 10000, signed: true });
  res.status(201).send({ msg: "Welcome to the Home Page!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Visit http://localhost:" + PORT);
});
