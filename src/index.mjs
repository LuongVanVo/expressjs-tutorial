import express from "express";
import routes from './routes/index.mjs';
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(routes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(201).send({ msg: "Welcome to the Home Page!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Visit http://localhost:" + PORT);
});