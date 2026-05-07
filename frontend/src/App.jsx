import React, { useState, useEffect } from 'react';
import './index.css';

const API_BASE_URL = '/api';

function App() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all lists on mount
  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lists`);
      if (response.ok) {
        const data = await response.json();
        setLists(data);
      }
    } catch (err) {
      console.error('Failed to fetch lists:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchListDetails = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lists/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedList(data);
      }
    } catch (err) {
      console.error('Failed to fetch list details:', err);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newListName }),
      });
      if (response.ok) {
        const newList = await response.json();
        setLists([...lists, newList]);
        setNewListName('');
        fetchListDetails(newList._id);
      }
    } catch (err) {
      console.error('Failed to create list:', err);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim() || !selectedList) return;

    try {
      const response = await fetch(`${API_BASE_URL}/lists/${selectedList._id}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodoText }),
      });
      if (response.ok) {
        const updatedList = await response.json();
        setSelectedList(updatedList);
        setNewTodoText('');
      }
    } catch (err) {
      console.error('Failed to add todo:', err);
    }
  };

  const handleToggleTodo = async (todoId, currentStatus) => {
    if (!selectedList) return;
    try {
      const response = await fetch(`${API_BASE_URL}/lists/${selectedList._id}/todos/${todoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (response.ok) {
        const updatedList = await response.json();
        setSelectedList(updatedList);
      }
    } catch (err) {
      console.error('Failed to toggle todo:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar for Lists */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Todo Lists</h2>
          <form className="create-list-form" onSubmit={handleCreateList}>
            <input
              type="text"
              className="input-field"
              placeholder="New list label..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button type="submit" className="btn-primary">+</button>
          </form>
        </div>
        
        <div className="lists-container">
          {loading ? (
            <p style={{color: 'var(--text-secondary)'}}>Loading...</p>
          ) : lists.length === 0 ? (
            <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>No lists created yet.</p>
          ) : (
            lists.map(list => (
              <div 
                key={list._id} 
                className={`list-item ${selectedList?._id === list._id ? 'active' : ''}`}
                onClick={() => fetchListDetails(list._id)}
              >
                {list.label}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content for Todos */}
      <div className="main-content">
        {!selectedList ? (
          <div className="empty-state">
            <h3>Select a list</h3>
            <p>Or create a new one to get started</p>
          </div>
        ) : (
          <div className="todo-view">
            <div className="todo-header">
              <h1>{selectedList.label}</h1>
            </div>
            
            <div className="todo-list-container">
              {selectedList.todos && selectedList.todos.length > 0 ? (
                selectedList.todos.map((todo, index) => (
                  <div key={todo._id || index} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <input 
                      type="checkbox" 
                      className="todo-checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo._id, todo.completed)}
                    />
                    <div className="todo-text">{todo.text}</div>
                    <div className="todo-date">
                      {new Date(todo.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No tasks yet. Add one below!</p>
                </div>
              )}
            </div>

            <div className="add-todo-container">
              <form className="add-todo-form" onSubmit={handleAddTodo}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="What needs to be done?"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                />
                <button type="submit" className="btn-primary">Add Task</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
