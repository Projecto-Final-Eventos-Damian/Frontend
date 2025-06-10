'use client';

export default function RatingCard({ rating }) {
  const stars = Array(5).fill('★').map((star, index) => (
    <span key={index} className={index < rating.rating ? 'text-yellow-400' : 'text-gray-300'}>
      {star}
    </span>
  ));

  return (
    <div className="border border-gray-200 rounded-xl shadow-md p-4 bg-white">
      <h3 className="text-lg font-semibold text-blue-600 mb-1">{rating.user.name}</h3>
      <div className="text-xl flex items-center mb-2">{stars}</div>
      {rating.review && <p className="text-gray-700">{rating.review}</p>}
    </div>
  );
}
