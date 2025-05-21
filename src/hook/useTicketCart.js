import { useState, useCallback } from 'react';

export function useTicketCart(ticketTypes = []) {
  const [cart, setCart] = useState({});

  const updateQuantity = useCallback((ticketTypeId, delta) => {
    setCart((prev) => {
      const current = prev[ticketTypeId] || 0;
      const next = Math.max(current + delta, 0);
      return { ...prev, [ticketTypeId]: next };
    });
  }, []);

  const totalPrice = ticketTypes.reduce((acc, type) => {
    const qty = cart[type.id] || 0;
    return acc + qty * Number(type.price);
  }, 0);

  return { cart, updateQuantity, totalPrice };
}