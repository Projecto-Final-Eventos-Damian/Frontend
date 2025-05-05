'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/profile');
    }
  }, []);

  return (
    <div>
      <h1>Profile de user</h1>
    </div>
  );
}