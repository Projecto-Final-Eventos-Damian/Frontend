'use client';

import { API_BASE_URL } from '@/utils/entorn';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, updateUser, deleteUserImage } from '@/services';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login?redirect=/profile');
        return;
      }

      try {
        const data = await getCurrentUser();
        setUser(data);
        setFormData({ name: data.name, email: data.email });
        setPreviewUrl(data.image_url ? `${API_BASE_URL}${data.image_url}` : `${API_BASE_URL}/public/images/users/default.png`);
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        toast.error('Error al cargar el perfil');
        router.replace('/login?redirect=/profile');
      }
    };

    loadUser();
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && /\.(jpg|jpeg|png)$/i.test(file.name)) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error('Solo se permiten imágenes .jpg, .jpeg o .png');
    }
  };

  const handleDeleteImage = async () => {
    try {
      const updatedUser = await deleteUserImage();
      setUser(updatedUser);
      setSelectedImage(null);
      setPreviewUrl(`${API_BASE_URL}/public/images/users/default.png`);
      toast.success('Imagen eliminada correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar imagen');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    if (selectedImage) {
      form.append('image', selectedImage);
    }

    try {
      const updatedUser = await updateUser(form);
      setUser(updatedUser);
      toast.success('Perfil actualizado correctamente');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-4">Cargando perfil...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Perfil de usuario</h1>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={previewUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div className="flex flex-col gap-2">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {user.image_url && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className="text-red-500 text-sm underline"
            >
              Eliminar imagen
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Rol</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded bg-gray-100"
            value={user.role}
            disabled
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}