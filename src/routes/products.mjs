import { Router } from "express";

const router = Router();

// Endpoint all products
router.get("/api/products", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies); // lấy cookie không có chữ ký
  console.log(req.signedCookies.hello); // lấy cookie có chữ ký, 
  if (req.signedCookies.hello && req.signedCookies.hello === "world") {
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
  }
  return res.status(403).send({ msg: "Sorry.You need the correct cookies." });
});

export default router;
