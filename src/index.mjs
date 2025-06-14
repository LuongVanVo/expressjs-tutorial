import express from 'express';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(201).send({ msg: 'Welcome to the Home Page!' });
});

const mockUsers = [
    { id: 1, username: 'anson', displayName: 'Anson', },
    { id: 2, username: 'john', displayName: 'John Doe', },
    { id: 3, username: 'jane', displayName: 'Jane Smith', },
]

// Endpoint to get all users with optional filtering
app.get('/api/users', (req, res) => {
    console.log(req.query); // quey has form key value
    const { 
        query: { filter, value },
    } = req;
    // when filter and value are undefined
    if (!filter && !value) return res.send(mockUsers);
    if (filter && value) return res.send(
        mockUsers.filter((user) => user[filter].includes(value))
    );
    // when filter is defined but value is not
    return res.send(mockUsers);
});

// Endpoint to create a new user
app.post('/api/users', (req, res) =>{
    console.log(req.body);
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    console.log(mockUsers);
    return res.status(201).send(newUser); 
})

// Endpoint to get a user by ID
app.get('/api/users/:id', (req, res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(`Parsed ID: ${parsedId}`);
    if (isNaN(parsedId)) {
        return res.status(400).send({ msg: 'Bad Request: Invalid ID. '})
    }
    const findUser = mockUsers.find(user => user.id === parsedId);
    if (!findUser) {
        return res.sendStatus(404);
    }
    return res.status(200).send(findUser);
});

// Endpoint all products
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
// localhost:3000/products?key=value&key2=value2

// Endpoint to update a user by ID
app.put('/api/users/:id', (req, res) => {
    const { 
        body, 
        params: { id } 
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);

    mockUsers[findUserIndex] = { id: parsedId, ...body };
    console.log(mockUsers);
    return res.status(200).send(mockUsers[findUserIndex]);
})