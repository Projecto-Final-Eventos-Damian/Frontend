'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/createEvents');
    }
  }, []);

  return (
    <div>
      <h1>Bienvenido a la creación de eventos</h1>
    </div>
  );
}
