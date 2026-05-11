function RepoCommands() {
  const commands = [
    {
      title: "Initialize repository",
      command: "node index.js init",
      description: "Create the local VCS folder structure.",
    },
    {
      title: "Stage a file",
      command: "node index.js add <file_name>",
      description: "Add a file to the staging area.",
    },
    {
      title: "Commit staged files",
      command: 'node index.js commit "<message>"',
      description: "Save staged changes with a commit message.",
    },
    {
      title: "Push commits",
      command: "node index.js push",
      description: "Upload commits to the configured S3 bucket.",
    },
    {
      title: "Pull commits",
      command: "node index.js pull",
      description: "Download commits from the configured S3 bucket.",
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