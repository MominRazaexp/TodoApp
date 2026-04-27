import { useState, useEffect } from 'react';

const API_BASE_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(() => setTodos([])); // Mock data fallback
  }, []);

  const addTodo = () => {
    if (!newTodo) return;
    fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    })
      .then(res => res.json())
      .then(todo => setTodos([...todos, todo]));
    setNewTodo('');
  };

  const toggleTodo = (id, completed) => {
    fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    })
      .then(() => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !completed } : todo));
      });
  };

  const deleteTodo = (id) => {
    fetch(`${API_BASE_URL}/todos/${id}`, { method: 'DELETE' })
      .then(() => setTodos(todos.filter(todo => todo.id !== id)));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={addTodo} className="bg-blue-500 text-white p-2">Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center my-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              className="mr-2"
            />
            <span className={todo.completed ? 'line-through' : ''}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="ml-2 text-red-500">Delete</button>
          </li>
        ))}
      </ul>
      <img src="https://res.cloudinary.com/proxmaircloud/image/upload/v1777288319/images/slfwlwi9qpdt2wtakfyf.png" alt="background image for a todo app" className="mt-4" />
    </div>
  );
}

export default TodoPage;