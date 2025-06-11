'use client';

import { API_BASE_URL } from "@/utils/entorn";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hook/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { followOrganizer, unfollowOrganizer, getFollowersCount, checkFollowStatus } from '@/services';

export default function OrganizerInfoEvent({ organizer, eventId }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const refreshFollowers = () => {
    getFollowersCount(organizer.id)
      .then(setFollowersCount)
      .catch(console.error);
  };

  const fetchFollowStatus = async () => {
    if (!user || !isAuthenticated) return;
    try {
      const res = await checkFollowStatus(user.id, organizer.id);
      setIsFollowing(res.is_following);
    } catch (err) {
      console.error("Error checking follow status:", err);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=/event/${eventId}`);
      return;
    }

    try {
      await followOrganizer({
        user_id: user.id,
        organizer_id: organizer.id,
      });
      toast.success(`Has seguido al organizador "${organizer.name}"`);
      setIsFollowing(true);
      refreshFollowers();
    } catch (err) {
      toast.error(err.message || "Error al seguir al organizador");
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowOrganizer({
        user_id: user.id,
        organizer_id: organizer.id,
      });
      toast.success(`Has dejado de seguir a "${organizer.name}"`);
      setIsFollowing(false);
      refreshFollowers();
    } catch (err) {
      toast.error(err.message || "Error al dejar de seguir al organizador");
    }
  };

  useEffect(() => {
    refreshFollowers();
    fetchFollowStatus();
  }, [organizer.id, isAuthenticated, user]);

  return (
    <div className="mt-6 p-4 border border-indigo-300 rounded-lg shadow bg-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          {organizer.image_url && (
            <img
              src={`${API_BASE_URL}${organizer.image_url}`}
              alt={organizer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
            />
          )}
          <div className="flex flex-col text-gray-700">
            <span className="font-semibold">{organizer.name}</span>
            <span>{followersCount} followers</span>
          </div>
        </div>
        {isAuthenticated && (
          <button
            className={`py-1 px-4 font-semibold rounded-full transition ${
              isFollowing ? "bg-red-500 hover:bg-red-600 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
            onClick={isFollowing ? handleUnfollow : handleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
}
