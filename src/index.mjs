import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(201).send({ msg: 'Welcome to the Home Page!' });
});

app.get('/api/users', (req, res) => {
    res.status(200).send([
        { id: 1, username: 'anson', displayName: 'Anson', },
        { id: 2, username: 'john', displayName: 'John Doe', },
        { id: 3, username: 'jane', displayName: 'Jane Smith', },
    ]);
});

app.get('/api/products', (req, res) => {
    res.send([
        { id: 123, name: 'chicken breast', price: 12.99 },
        { id: 456, name: 'broccoli', price: 3.99 },
        { id: 789, name: 'rice', price: 1.99 },
        { id: 101, name: 'olive oil', price: 5.49 },
        { id: 102, name: 'salt', price: 0.99 },
        { id: 103, name: 'pepper', price: 1.49 },
        { id: 104, name: 'garlic', price: 0.79 },
        { id: 105, name: 'onion', price: 0.89 },
        { id: 106, name: 'spinach', price: 2.49 },
        { id: 107, name: 'tomato', price: 0.99 },
    ]);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Visit http://localhost:" + PORT);
});

// localhost:3000
// localhost:3000/users
// localhost:3000/products
