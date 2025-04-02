const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let inventory = []; // In-memory database (you can replace this with a real database)

app.get('/inventory', (req, res) => {
  res.json(inventory);
});

app.post('/inventory', (req, res) => {
  const newItem = req.body;
  newItem.id = Date.now(); // Generate a unique ID
  inventory.push(newItem);
  res.json(newItem);
});

app.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const index = inventory.findIndex(item => item.id == id);
  if (index !== -1) {
    inventory[index] = { ...inventory[index], ...updatedItem };
    res.json(inventory[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;
  inventory = inventory.filter(item => item.id != id);
  res.json({ message: 'Item deleted' });
});

const port = 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
