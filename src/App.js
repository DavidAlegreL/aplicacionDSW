import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error obteniendo usuarios', error);
    }
  };

  const createUser = async () => {
    try {
      await axios.post('/users', { name, password });
      fetchUsers();
    } catch (error) {
      console.error('Error creando usuario', error);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.post('/users/delete', { userId });
      fetchUsers();
    } catch (error) {
      console.error('Error borrando usuario', error);
    }
  };

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <h2>Crear Usuario</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={createUser}>Crear</button>
      <h2>Borrar Usuario</h2>
      <input
        type="text"
        placeholder="ID de Usuario"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <button onClick={deleteUser}>Borrar</button>
    </div>
  );
}

export default App;