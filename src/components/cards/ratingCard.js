'use client';

export default function RatingCard({ rating }) {
  const stars = Array(5).fill('★').map((star, index) => (
    <span
      key={index}
      className={`text-2xl ${index < rating.rating ? 'text-yellow-400' : 'text-gray-300'}`}
    >
      {star}
    </span>
  ));

  return (
    <div className="border border-gray-200 rounded-2xl shadow-md p-6 bg-white hover:shadow-lg transition flex flex-col gap-3">
      <h3 className="text-xl font-bold text-indigo-700">{rating.user.name}</h3>

      <div className="flex items-center gap-1">
        {stars}
      </div>

      {rating.review && (
        <p className="text-gray-00 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-indigo-300">
          {rating.review}
        </p>
      )}
    </div>
  );
}
