import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

const requests = [
  {
    id: 1,
    title: 'Projector does not turn on',
    description: 'The projector in room 204 shows no image during class.',
    status: 'open',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Broken chair in the lab',
    description: 'One chair in the computer lab has a loose back rest.',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Wi-Fi drops in the library',
    description: 'The connection drops every few minutes on the second floor.',
    status: 'open',
    priority: 'low'
  }
];

let nextId = 4;

// GET /requests (con soporte opcional de filtro ?status=)
app.get('/requests', (req, res) => {
  const { status } = req.query;
  if (status) {
    const filtered = requests.filter(
      (item) => item.status.toLowerCase() === status.toLowerCase()
    );
    return res.status(200).json(filtered);
  }
  res.status(200).json(requests);
});

// GET /requests/:id
app.get('/requests/:id', (req, res) => {
  const id = Number(req.params.id);
  const request = requests.find((item) => item.id === id);

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.status(200).json(request);
});

// POST /requests
app.post('/requests', (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Field "title" is required' });
  }

  const newRequest = {
    id: nextId++,
    title: title.trim(),
    description: description || '',
    status: 'open',
    priority: priority || 'medium'
  };

  requests.push(newRequest);
  res.status(201).json(newRequest);
});

app.listen(PORT, () => {
  console.log(`Request API Lite (corregida) corriendo en http://localhost:${PORT}`);
}); 