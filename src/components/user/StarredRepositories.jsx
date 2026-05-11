import React, { useEffect, useState } from "react";
import axios from "axios";
import { GrStar } from "react-icons/gr";
import { GoFileDirectoryFill } from "react-icons/go";
import { FaRegFaceSadCry } from "react-icons/fa6";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function StarredRepositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStarredRepos = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/repo/starred/${userId}`);
        setRepositories(response.data?.starredRepos ?? []);
        setError("");
      } catch (err) {
        console.error("Error while fetching starred repositories:", err);
        setRepositories([]);
        setError("Unable to load starred repositories.");
      } finally {
        setLoading(false);
      }
    };

    fetchStarredRepos();
  }, []);

  const handleUnstarRepository = async (repositoryId) => {
    const userId = localStorage.getItem("userId");
    if (!userId || !repositoryId) return;

    try {
      await axios.patch(`${API_BASE_URL}/repo/unstar/${repositoryId}`, { userId });
      setRepositories((prev) =>
        prev.filter((repo) => String(repo._id) !== String(repositoryId)),
      );
    } catch (err) {
      console.error("Error while unstarring repository:", err);
      setError("Unable to unstar repository.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-[#0d1117] px-6 py-12 text-center text-sm text-gray-400">
        Loading starred repositories...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-[#0d1117] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-base font-semibold text-[#c9d1d9]">
          <GrStar className="h-4 w-4 text-yellow-400" aria-hidden />
          Starred repositories
        </h3>
        <span className="rounded-full bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-400">
          {repositories.length}
        </span>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {repositories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
          <FaRegFaceSadCry className="h-10 w-10 opacity-80" aria-hidden />
          <p>No starred repositories yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#30363d]">
          {repositories.map((repository) => (
            <li key={repository._id} className="py-4 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-start gap-3 cursor-pointer">
                  <span className="mt-0.5 rounded-md bg-gray-800 p-2">
                    <GoFileDirectoryFill
                      className="h-4 w-4 text-blue-400"
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0 cursor-pointer">
                    <h4 className="truncate text-base font-semibold text-[#58a6ff]">
                      {repository.name}
                    </h4>
                    {repository.description ? (
                      <p className="mt-1 text-sm text-gray-400">
                        {repository.description}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm italic text-gray-600">
                        No description
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUnstarRepository(repository._id)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-1.5 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-500/20"
                >
                  <GrStar className="h-4 w-4" aria-hidden />
                  Starred
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StarredRepositories;
