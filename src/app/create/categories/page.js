'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm from '@/components/forms/categoryForm';
import { createCategory } from '@/services';
import { toast } from 'react-hot-toast';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login?redirect=/create/categories');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleCreateCategory = async (categoryData) => {
    try {
      await createCategory(categoryData);
      router.push('/dashboard');
      toast.success('Categoría creada con éxito');
    } catch (err) {
      toast.error(err.message || 'Error al crear la categoría');
    }
  };

  if (!authorized) return null;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear nueva categoría</h1>
      <CategoryForm onSubmit={handleCreateCategory} />
    </div>
  );
}
