let requests = [
  {
    id: 1,
    title: 'Projector does not turn on',
    description: 'The projector in room 204 shows no image during class.',
    status: 'open',
    priority: 'high',
    createdAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 2,
    title: 'Broken chair in the lab',
    description: 'One chair in the computer lab has a loose back rest.',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2026-03-01T09:30:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 3,
    title: 'Wi-Fi drops in the library',
    description: 'The connection drops every few minutes on the second floor.',
    status: 'open',
    priority: 'low',
    createdAt: '2026-03-01T11:15:00.000Z',
    updatedAt: '2026-03-01T11:15:00.000Z',
  },
];

let nextId = 4;

export function findAll({ status, priority } = {}) {
  let result = requests;

  if (status) {
    result = result.filter((r) => r.status === status);
  }

  if (priority) {
    result = result.filter((r) => r.priority === priority);
  }

  return result;
}

export function findById(id) {
  return requests.find((r) => r.id === id) || null;
}

export function create({ title, description, priority }) {
  const now = new Date().toISOString();
  const newRequest = {
    id: nextId++,
    title,
    description: description || '',
    status: 'open',
    priority: priority || 'medium',
    createdAt: now,
    updatedAt: now,
  };

  requests.push(newRequest);
  return newRequest;
}

export function update(id, fields) {
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = requests[index];
  const now = new Date().toISOString();

  const updated = {
    ...current,
    ...(fields.title !== undefined && { title: fields.title }),
    ...(fields.description !== undefined && { description: fields.description }),
    ...(fields.status !== undefined && { status: fields.status }),
    ...(fields.priority !== undefined && { priority: fields.priority }),
    updatedAt: now,
  };

  requests[index] = updated;
  return updated;
} 