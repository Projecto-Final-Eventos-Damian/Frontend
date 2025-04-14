"use client";

import { useEffect, useState } from 'react';

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzQ0NjU1MDU4fQ.07168RYr_2yDY368ca7qq1gFcfTzQZgJIXqwjbOOdQE";
          
          const response = await fetch('http://localhost:8000/users', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Hubo un error al obtener los datos');
          }
          
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error('Error:', error);
          setData(null);
        }
      };
      

    fetchData();
  }, []);

  if (!data) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Bienvenido a mi aplicación</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Home;
