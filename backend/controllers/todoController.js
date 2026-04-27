import { getDB } from '../models/db.js';

export const getTodos = (req, res) => {
  const db = getDB();
  db.all(';;SELECT * FROM todos', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch todos' });
    }
    res.json(rows);
  });
};

export const createTodo = (req, res) => {
  const db = getDB();
  const { text } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  db.run('INSERT INTO todos (text) VALUES (?)', [text], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create todo' });
    }
    res.json({ id: this.lastID, text, completed: 0 });
  });
};

export const updateTodo = (req, res) => {
  const db = getDB();
  const { id } = req.params || {};
  const { text, completed } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  db.run('UPDATE todos SET text = ?, completed = ? WHERE id = ?', [text || '', completed || 0, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update todo' });
    }
    res.json({ message: 'Todo updated' });
  });
};

export const deleteTodo = (req, res) => {
  const db = getDB();
  const { id } = req.params || {};
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  db.run('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete todo' });
    }
    res.json({ message: 'Todo deleted' });
  });
};