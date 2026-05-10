import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoRepo } from "react-icons/go";
import { IoArrowBack } from "react-icons/io5";

export default function NewRepository() {
  const navigate = useNavigate();
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setOwner(userId);
  }, []);

  const handleCreateRepository = async (e) => {
    e.preventDefault();

    if (!owner) {
      alert("You must be signed in to create a repository.");
      return;
    }
    if (!name.trim()) {
      alert("Repository name is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3000/repo/create`, {
        owner,
        name: name.trim(),
        description: description.trim(),
        visibility,
      });
      alert(response.data?.message || "Repository created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error creating a new repository!", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong.";
      alert(typeof msg === "string" ? msg : "Error creating repository.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60";

  return (
    <div className="min-h-full bg-gray-900 px-3 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-lg">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          <IoArrowBack className="h-4 w-4" aria-hidden />
          Back to dashboard
        </Link>

        <div className="rounded-xl border border-gray-800 bg-gray-800 p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/15 ring-1 ring-blue-500/30">
              <GoRepo className="h-8 w-8 text-blue-400" aria-hidden />
            </span>
          </div>

          <h1 className="text-center text-2xl font-bold tracking-tight text-white">
            Create a new repository
          </h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Repositories contain your code, history, and collaborators.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleCreateRepository}>
            <div>
              <label
                htmlFor="owner"
                className="block text-sm font-medium text-gray-300"
              >
                Owner
              </label>
              <input
                type="text"
                id="owner"
                name="owner"
                readOnly
                autoComplete="off"
                value={owner}
                className={`${inputClass} cursor-not-allowed bg-gray-800/80`}
                placeholder="Sign in required"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your account ID — used when creating on the backend.
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Repository name{" "}
                <span className="text-red-400" aria-hidden>
                  *
                </span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-awesome-project"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Description{" "}
                <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                autoComplete="off"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of what this repo is for"
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="visibility"
                  checked={visibility}
                  onChange={(e) => setVisibility(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-gray-500 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-gray-900"
                />
                <div>
                  <label
                    htmlFor="visibility"
                    className="text-sm font-medium text-gray-200"
                  >
                    Public visibility
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    When enabled, visibility is flagged as public in your schema
                    (boolean).
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !owner}
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create repository"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
