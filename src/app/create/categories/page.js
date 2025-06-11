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
      router.back();
      toast.success('Categoría creada con éxito');
    } catch (err) {
      toast.error(err.message || 'Error al crear la categoría');
    }
  };

  if (!authorized) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Crear nueva categoría</h1>
      <div className="bg-white shadow-md rounded-2xl p-6">
        <CategoryForm onSubmit={handleCreateCategory} />
      </div>
    </div>
  );
}
