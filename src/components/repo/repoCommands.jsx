import { useLocation } from "react-router-dom";

function RepoCommands() {
  const { state } = useLocation();
  const repositoryId = state?.repositoryId;
  const repositoryName = state?.repositoryName;
  const repoPlaceholder = repositoryId || "<repo_id>";
  const initCommand = `node index.js init --repoId ${repoPlaceholder}`;

  const commands = [
    {
      title: "Initialize repository",
      command: initCommand,
      description: "Create the local VCS folder structure and link it to this frontend repo.",
    },
    {
      title: "Stage a file",
      command: "node index.js add <file_name>",
      description: "Add a file to the staging area.",
    },
    {
      title: "Commit staged files",
      command: 'node index.js commit "<message>"',
      description: "Save staged changes with a commit message. The linked repo ID is stored in .vcsGit/config.json.",
    },
    {
      title: "Push commits",
      command: "node index.js push",
      description: "Upload commits to the S3 path for the linked frontend repo.",
    },
    {
      title: "Pull commits",
      command: "node index.js pull",
      description: "Download commits from the S3 path for the linked frontend repo.",
    },
    {
      title: "Revert commit",
      command: "node index.js revert <commit_id>",
      description: "Restore files from a specific commit.",
    },
  ];

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
            MongoDB repository ID shown after creating a repo.
          </div>
        )}
      </div>

      <ul className="space-y-4">
        {commands.map((item) => (
          <li
            key={item.command}
            className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 transition-colors hover:border-blue-500/50 hover:bg-gray-900"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-100">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-gray-400">{item.description}</p>
              </div>

              <code className="block rounded-lg border border-gray-700 bg-black/50 px-3 py-2 font-mono text-sm text-green-300 sm:min-w-[280px]">
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