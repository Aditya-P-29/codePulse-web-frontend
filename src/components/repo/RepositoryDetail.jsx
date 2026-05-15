import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import { API_BASE_URL } from "../../config/api";

function formatBytes(bytes) {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function RepositoryDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!id) return;
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_BASE_URL}/repo/${id}/files`);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching repository files:", err);
        setError("Unable to load repository files.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [id]);

  const filesByCommit = useMemo(() => {
    const groups = new Map();
    for (const file of data?.files ?? []) {
      if (!groups.has(file.commitId)) {
        groups.set(file.commitId, []);
      }
      groups.get(file.commitId).push(file);
    }
    return groups;
  }, [data]);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/profile"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-[#58a6ff]"
      >
        <IoArrowBack aria-hidden />
        Back to profile
      </Link>

      <header className="mb-6 rounded-xl border border-gray-800 bg-[#0d1117] p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-md bg-gray-800 p-2">
            <GoFileDirectoryFill className="h-5 w-5 text-blue-400" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {data?.repositoryName ?? "Repository"}
            </h1>
            <p className="mt-1 font-mono text-xs text-gray-500">{id}</p>
            <p className="mt-2 text-sm text-gray-400">
              Files pushed from the CLI appear here after{" "}
              <code className="rounded bg-gray-800 px-1 py-0.5 text-xs">
                node index.js push
              </code>
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-gray-400">Loading files…</p>
      ) : error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : (data?.files?.length ?? 0) === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-[#0d1117] px-6 py-16 text-center">
          <p className="text-gray-400">No files pushed yet.</p>
          <p className="mt-2 text-sm text-gray-500">
            Run init, add, commit, and push from the CLI to upload files to this
            repo.
          </p>
          <Link
            to="/repo/commands"
            state={{
              repositoryId: id,
              repositoryName: data?.repositoryName,
            }}
            className="mt-4 inline-block text-sm text-[#58a6ff] hover:underline"
          >
            View CLI commands
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            {data.files.length} file{data.files.length === 1 ? "" : "s"} in S3
          </p>

          {[...filesByCommit.entries()].map(([commitId, files]) => (
            <section
              key={commitId}
              className="overflow-hidden rounded-xl border border-gray-800 bg-[#0d1117]"
            >
              <div className="border-b border-gray-800 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-300">Commit</h2>
                <p className="mt-0.5 truncate font-mono text-xs text-gray-500">
                  {commitId}
                </p>
              </div>

              <ul className="divide-y divide-gray-800">
                {files.map((file) => (
                  <li
                    key={file.key}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                  >
                    <span className="font-medium text-[#58a6ff]">
                      {file.fileName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatBytes(file.size)}
                      {file.lastModified
                        ? ` · ${new Date(file.lastModified).toLocaleString()}`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default RepositoryDetail;
