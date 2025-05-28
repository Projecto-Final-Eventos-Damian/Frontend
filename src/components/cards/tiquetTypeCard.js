'use client';

import Link from 'next/link';

export default function TicketTypeCard({ ticket }) {
  return (
    <div className="border p-4 rounded shadow relative flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{ticket.name}</h3>
        <p className="text-sm text-gray-600">{ticket.description}</p>
        <p className="font-medium mt-1">${ticket.price}</p>
      </div>

      <Link
          href={`/edit/tiquetType/${ticket.id}`}
          title="Editar"
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-3 py-2 flex justify-center items-center"
          >
        <i className="bi bi-pencil text-lg"></i>
      </Link>
    </div>
  );s
}
