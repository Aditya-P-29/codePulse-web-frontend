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
  const [usingFallback, setUsingFallback] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      setUsingFallback(false);

      try {
        const fileEndpoints = [
          `${API_BASE_URL}/repo/${id}/files`,
          `${API_BASE_URL}/repo/files/${id}`,
          `${API_BASE_URL}/repo/${id}?files=true`,
        ];

        for (const url of fileEndpoints) {
          try {
            const response = await axios.get(url);
            setData(response.data);
            return;
          } catch (err) {
            if (err.response?.status !== 404) {
              console.error("Error fetching repository files:", err);
            }
          }
        }

        const response = await axios.get(`${API_BASE_URL}/repo/${id}`);
        const repo = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (!repo) {
          setError("Repository not found.");
          setData(null);
          return;
        }

        const commits = repo.content || [];
        setData({
          repositoryId: repo._id,
          repositoryName: repo.name,
          commits,
          files: commits.map((commitId) => ({
            commitId,
            fileName: "Pushed commit (update EC2 backend to list file names)",
            key: commitId,
          })),
        });
        setUsingFallback(true);
      } catch (err) {
        console.error("Error fetching repository:", err);
        setError(
          "Unable to load repository files. Redeploy the backend on EC2 (commit 24300b7 or newer).",
        );
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

  const handleViewFile = async (file) => {
    if (usingFallback) return;

    setSelectedFile(file);
    setContentLoading(true);
    setContentError("");
    setFileContent(null);

    const params = new URLSearchParams({
      commitId: file.commitId,
      fileName: file.fileName,
    });

    const contentUrls = [
      `${API_BASE_URL}/repo/${id}/file-content?${params}`,
    ];

    try {
      for (const url of contentUrls) {
        try {
          const response = await axios.get(url);
          setFileContent(response.data);
          return;
        } catch (err) {
          console.error("Error fetching file content:", err);
          setContentError(
            err.response?.data?.error ||
              "Unable to load file content. Deploy the latest backend on EC2.",
          );
        }
      }
    } finally {
      setContentLoading(false);
    }
  };

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

      {usingFallback ? (
        <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Showing pushed commit IDs from the database. On EC2 run{" "}
          <code className="text-xs">git pull</code> and{" "}
          <code className="text-xs">pm2 restart codepulse-backend</code>, then
          refresh to see file names from S3.
        </p>
      ) : null}

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
                {files.map((file) => {
                  const isSelected =
                    selectedFile?.key === file.key ||
                    (selectedFile?.commitId === file.commitId &&
                      selectedFile?.fileName === file.fileName);

                  return (
                    <li key={file.key}>
                      <button
                        type="button"
                        onClick={() => handleViewFile(file)}
                        disabled={usingFallback}
                        className={`flex w-full flex-wrap items-center justify-between gap-2 px-4 py-3 text-left transition-colors ${
                          isSelected
                            ? "bg-[#161b22]"
                            : "hover:bg-[#161b22]/80"
                        } ${usingFallback ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
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
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {selectedFile ? (
            <section className="overflow-hidden rounded-xl border border-gray-800 bg-[#0d1117]">
              <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-300">
                    File preview
                  </h2>
                  <p className="mt-0.5 font-mono text-xs text-[#58a6ff]">
                    {selectedFile.fileName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileContent(null);
                    setContentError("");
                  }}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              {contentLoading ? (
                <p className="px-4 py-6 text-sm text-gray-400">Loading file…</p>
              ) : contentError ? (
                <p className="px-4 py-6 text-sm text-red-300">{contentError}</p>
              ) : fileContent?.encoding === "base64" ? (
                <p className="px-4 py-6 text-sm text-gray-400">
                  Binary file preview is not supported.
                </p>
              ) : (
                <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm text-gray-200">
                  {fileContent?.content ?? ""}
                </pre>
              )}
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default RepositoryDetail;
