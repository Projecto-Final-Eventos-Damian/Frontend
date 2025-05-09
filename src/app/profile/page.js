'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/petitions';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/profile');
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch((err) => {
        console.error('Error al cargar usuario:', err);
        setError('No se pudo obtener el usuario');
      });
  }, [router]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!user) return <div className="p-4">Cargando perfil...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}
