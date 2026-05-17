import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";
import { API_BASE_URL } from "../../config/api";

function RepoCommands() {
  const { state } = useLocation();
  const repositoryId = state?.repositoryId;
  const repositoryName = state?.repositoryName;
  const commitIdsFromNav = state?.commitIds;

  const [commitIds, setCommitIds] = useState(commitIdsFromNav ?? []);
  const [copiedCommitId, setCopiedCommitId] = useState(null);

  const repoPlaceholder = repositoryId || "<repo_id>";
  const initCommand = `node index.js init --repoId ${repoPlaceholder}`;
  const revertPlaceholder = "<commit_id>";

  useEffect(() => {
    if (commitIdsFromNav?.length) {
      setCommitIds(commitIdsFromNav);
      return;
    }

    if (!repositoryId) return;

    const fetchCommits = async () => {
      const urls = [
        `${API_BASE_URL}/repo/${repositoryId}/files`,
        `${API_BASE_URL}/repo/files/${repositoryId}`,
        `${API_BASE_URL}/repo/${repositoryId}?files=true`,
      ];

      for (const url of urls) {
        try {
          const response = await axios.get(url);
          const commits = response.data?.commits ?? [];
          const fromFiles = (response.data?.files ?? []).map((f) => f.commitId);
          setCommitIds([...new Set([...commits, ...fromFiles])]);
          return;
        } catch {
          // try next endpoint
        }
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/repo/${repositoryId}`);
        const repo = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setCommitIds(repo?.content ?? []);
      } catch {
        setCommitIds([]);
      }
    };

    fetchCommits();
  }, [repositoryId, commitIdsFromNav]);

  const revertExampleId = commitIds[0] ?? revertPlaceholder;
  const revertCommand = `node index.js revert ${revertExampleId}`;

  const commands = useMemo(
    () => [
      {
        title: "Initialize repository",
        command: initCommand,
        description:
          "Create the local VCS folder structure and link it to this frontend repo.",
      },
      {
        title: "Stage a file",
        command: "node index.js add <file_name>",
        description: "Add a file to the staging area.",
      },
      {
        title: "Commit staged files",
        command: 'node index.js commit "<message>"',
        description:
          "Save staged changes with a commit message. The linked repo ID is stored in .vcsGit/config.json.",
      },
      {
        title: "Push commits",
        command: "node index.js push",
        description: "Upload commits to the S3 path for the linked frontend repo.",
      },
      {
        title: "Pull commits",
        command: "node index.js pull",
        description:
          "Download commits from the S3 path for the linked frontend repo.",
      },
      {
        title: "Revert commit",
        command: revertCommand,
        description: "Restore files from a specific commit.",
        isRevert: true,
      },
    ],
    [initCommand, revertCommand],
  );

  const handleCopyCommitId = async (commitId) => {
    try {
      await navigator.clipboard.writeText(String(commitId));
      setCopiedCommitId(commitId);
      window.setTimeout(() => setCopiedCommitId(null), 2000);
    } catch {
      setCopiedCommitId(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-800 bg-gray-950/70 p-5 text-white shadow-2xl shadow-black/30 sm:p-7">
      <div className="mb-6 border-b border-gray-800 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
          CLI Reference
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Repository Commands
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
          Run these commands from the backend folder to manage your local VCS
          repository and sync commits with S3.
        </p>
        {repositoryId ? (
          <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
            <p className="font-semibold">Linked repo from frontend</p>
            <p className="mt-1 text-blue-200/80">
              {repositoryName ? `${repositoryName} · ` : ""}
              <span className="font-mono">{repositoryId}</span>
            </p>
            <div className="mt-3 rounded-lg border border-blue-400/20 bg-black/30 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                Run this first
              </p>
              <code className="block break-all font-mono text-sm text-green-300">
                {initCommand}
              </code>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
            Replace <span className="font-mono">&lt;repo_id&gt;</span> with the
            MongoDB repository ID shown on a repository page.
          </div>
        )}

        {commitIds.length > 0 ? (
          <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3 text-sm text-purple-100">
            <p className="font-semibold">Commit IDs for revert</p>
            <p className="mt-1 text-xs text-purple-200/80">
              Copy a commit ID from your repo page, or use the commands below.
            </p>
            <ul className="mt-3 space-y-2">
              {commitIds.map((commitId) => (
                <li
                  key={commitId}
                  className="rounded-lg border border-purple-400/20 bg-black/30 p-3"
                >
                  <div className="flex items-start gap-2">
                    <code className="min-w-0 flex-1 break-all font-mono text-xs text-purple-100">
                      {commitId}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyCommitId(commitId)}
                      className="shrink-0 rounded-md border border-purple-400/30 bg-black/30 p-1.5 text-purple-200 hover:text-white"
                      title="Copy commit ID"
                      aria-label="Copy commit ID"
                    >
                      {copiedCommitId === commitId ? (
                        <IoCheckmark className="h-4 w-4 text-green-400" aria-hidden />
                      ) : (
                        <IoCopyOutline className="h-4 w-4" aria-hidden />
                      )}
                    </button>
                  </div>
                  <code className="mt-2 block break-all font-mono text-xs text-green-300">
                    node index.js revert {commitId}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        ) : repositoryId ? (
          <p className="mt-4 text-xs text-gray-500">
            No commits yet. Push from the CLI, then open this repo to see commit
            IDs here.
          </p>
        ) : null}
      </div>

      <ul className="space-y-4">
        {commands.map((item) => (
          <li
            key={item.title}
            className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 transition-colors hover:border-blue-500/50 hover:bg-gray-900"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-100">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                {item.isRevert && commitIds.length > 1 ? (
                  <p className="mt-2 text-xs text-gray-500">
                    Use any commit ID from the list above.
                  </p>
                ) : null}
              </div>

              <code className="block break-all rounded-lg border border-gray-700 bg-black/50 px-3 py-2 font-mono text-sm text-green-300 sm:min-w-[280px]">
                {item.command}
              </code>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RepoCommands;
