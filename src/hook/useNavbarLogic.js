'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hook/authContext';
import { getCurrentUser } from '@/services';

export function useNavbarLogic() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (isAuthenticated) {
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error al obtener usuario:', err);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    dropdownOpen,
    toggleDropdown,
    closeDropdown,
    handleLogout,
  };
}
