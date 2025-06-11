'use client';

import Link from 'next/link';

export default function TicketTypeCard({ ticket }) {
  return (
    <div className="border border-gray-200 p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition bg-white">
      <div className="space-y-1 w-full">
        <h3 className="text-xl font-bold text-indigo-700">{ticket.name}</h3>
        <p className="text-gray-600 text-sm">{ticket.description}</p>
        <p className="text-green-600 font-semibold mt-2">{parseFloat(ticket.price).toFixed(2)} €</p>
      </div>

      <Link
        href={`/edit/tiquetType/${ticket.id}`}
        title="Editar"
        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4 py-2 flex justify-center items-center gap-2 transition w-full md:w-auto"
      >
        <i className="bi bi-pencil text-lg"></i> Editar
      </Link>
    </div>
  );
}
