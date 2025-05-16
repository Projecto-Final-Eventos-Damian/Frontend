'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm from '@/components/forms/categoryForm';
import { createCategory } from '@/services';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/createCategory');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleCreateCategory = async (categoryData) => {
    setError('');
    setSuccessMessage('');

    try {
      await createCategory(categoryData);
      setSuccessMessage('Categoría creada con éxito');
    } catch (err) {
      setError(err.message || 'Error al crear la categoría');
    }
  };

  if (!authorized) return null;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear nueva categoría</h1>
      <CategoryForm onSubmit={handleCreateCategory} error={error} />
      {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
    </div>
  );
}