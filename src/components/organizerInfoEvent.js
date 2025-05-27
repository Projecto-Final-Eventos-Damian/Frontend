'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hook/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  followOrganizer,
  unfollowOrganizer,
  getFollowersCount,
  checkFollowStatus,
} from '@/services';

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
    <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-2">Organizado por</h2>
      <p>
        {organizer.name} con {followersCount} <strong>followers</strong>{" "}
        {isAuthenticated && (
          <button
            className={`ml-2 py-1 px-3 text-white font-semibold rounded-md transition duration-300 ${
              isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={isFollowing ? handleUnfollow : handleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </p>
    </div>
  );
}
