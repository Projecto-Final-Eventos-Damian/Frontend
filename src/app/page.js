"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/userCard.js";

export default function Home() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzQ0NzM4MzQ5fQ.akgwXEsl4EBtnI7WQ9OBAb5zL-m8ELmF0Li9yAKKFxI";

        const response = await fetch("http://localhost:8000/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Error:", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  if (!users) {
    return <p className="p-4">Cargando usuarios...</p>;
  }

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-6">Usuarios</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
