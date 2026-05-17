import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

function FollowButton({
  targetUserId,
  targetUsername,
  className = "",
  size = "md",
}) {
  const currentUserId = localStorage.getItem("userId");
  const isOwnProfile =
    currentUserId &&
    targetUserId &&
    String(currentUserId) === String(targetUserId);

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const fetchFollowState = useCallback(async () => {
    if (!targetUserId || isOwnProfile) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/${targetUserId}/follow-stats`,
        { params: { viewerId: currentUserId } },
      );
      setIsFollowing(Boolean(response.data?.isFollowing));
    } catch (err) {
      console.error("Error fetching follow state:", err);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, currentUserId, isOwnProfile]);

  useEffect(() => {
    fetchFollowState();
  }, [fetchFollowState]);

  const handleToggleFollow = async () => {
    if (!currentUserId || !targetUserId || isOwnProfile || busy) return;

    setBusy(true);
    const endpoint = isFollowing ? "unfollow" : "follow";

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/user/${endpoint}/${targetUserId}`,
        { userId: currentUserId },
      );
      setIsFollowing(Boolean(response.data?.isFollowing));
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setBusy(false);
    }
  };

  if (!targetUserId || isOwnProfile) {
    return null;
  }

  const sizeClass =
    size === "sm"
      ? "px-2.5 py-1 text-xs"
      : "w-full max-w-[200px] py-2 text-sm";

  return (
    <button
      type="button"
      onClick={handleToggleFollow}
      disabled={loading || busy}
      className={`rounded-md border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${sizeClass} ${
        isFollowing
          ? "border-gray-600 bg-gray-800 text-white hover:border-gray-500 hover:bg-gray-700"
          : "border-blue-500/50 bg-blue-600 text-white hover:bg-blue-500"
      } ${className}`}
      aria-label={
        targetUsername
          ? `${isFollowing ? "Unfollow" : "Follow"} ${targetUsername}`
          : isFollowing
            ? "Unfollow user"
            : "Follow user"
      }
    >
      {loading ? "…" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
