export default function UserCard({ user }) {
    return (
      <div className="bg-white shadow rounded p-4 border border-gray-200">
        <h3 className="text-lg font-bold text-blue-600">{user.name}</h3>
        <p className="text-gray-700">Email: {user.email}</p>
        <p className="text-gray-500 text-sm">ID: {user.id}</p>
      </div>
    );
  }
  