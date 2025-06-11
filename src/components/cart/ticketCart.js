import React from "react";

export default function TicketCart({ ticketTypes, cart, updateQuantity, totalPrice }) {
  return (
    <div className="mt-10 p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Compra tus Tickets</h2>

      <div className="space-y-4">
        {ticketTypes.map((type) => (
          <div key={type.id} className="flex items-center justify-between p-4 bg-white rounded shadow hover:scale-[1.02] transition-transform">
            <div>
              <p className="font-semibold">{type.name}</p>
              <p className="text-sm text-gray-600">{type.description}</p>
              <p className="text-indigo-600 font-bold">${Number(type.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(type.id, -1)}
                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                -
              </button>
              <span className="min-w-[20px] text-center">{cart[type.id] || 0}</span>
              <button
                onClick={() => updateQuantity(type.id, 1)}
                className="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Resumen</h3>
        {Object.keys(cart).length === 0 ? (
          <p>No has seleccionado ningún ticket.</p>
        ) : (
          <>
            <ul className="space-y-1">
              {ticketTypes
                .filter((type) => cart[type.id] > 0)
                .map((type) => (
                  <li key={type.id} className="flex justify-between">
                    <span>{cart[type.id]}x {type.name}</span>
                    <span>${(cart[type.id] * Number(type.price)).toFixed(2)}</span>
                  </li>
                ))}
            </ul>
            <p className="mt-2 font-bold text-right text-indigo-600">Total: ${totalPrice.toFixed(2)}</p>
          </>
        )}
      </div>
    </div>
  );
}