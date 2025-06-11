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

  if (!user) return <div className="p-4 text-center">Cargando perfil...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Perfil de Usuario</h1>

      <div className="flex flex-col items-center gap-4 mb-6">
        <img
          src={previewUrl}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-md"
        />
        <div className="flex flex-col items-center gap-2 border border-indigo-300 p-3 rounded-2xl bg-white hover:bg-gray-100 transition-bg duration-300">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
          {user.image_url && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className="text-red-500 text-sm underline hover:text-red-700"
            >
              Eliminar imagen
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            value={user.role}
            disabled
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg w-full transition"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}