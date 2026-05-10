import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaRegFaceSadCry } from "react-icons/fa6";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";

function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [promptDraft, setPromptDraft] = useState("");
  const promptInputRef = useRef(null);

  const dismiss = useCallback(() => setDialog(null), []);

  /** Centered modal: resolve(true|false) */
  const confirmModal = useCallback((opts) => {
    return new Promise((resolve) => {
      setDialog({
        kind: "confirm",
        title: opts.title ?? "Confirm",
        message: opts.message,
        confirmLabel: opts.confirmLabel ?? "Continue",
        cancelLabel: opts.cancelLabel ?? "Cancel",
        variant: opts.variant ?? "neutral",
        resolve,
      });
    });
  }, []);

  /** Centered modal: resolve(string|null) — null when cancelled */
  const promptModal = useCallback((opts) => {
    return new Promise((resolve) => {
      const initial = opts.defaultValue ?? "";
      setPromptDraft(initial);
      setDialog({
        kind: "prompt",
        title: opts.title ?? "Confirm",
        message: opts.message,
        placeholder: opts.placeholder ?? "",
        variant: opts.variant ?? "neutral",
        resolve,
      });
    });
  }, []);

  /** Single-action OK modal */
  const alertModal = useCallback((opts) => {
    return new Promise((resolve) => {
      setDialog({
        kind: "alert",
        title: opts.title ?? "Notice",
        message: opts.message,
        variant: opts.variant ?? "info",
        resolve,
      });
    });
  }, []);

  useEffect(() => {
    if (!dialog || dialog.kind !== "prompt") return;
    const t = requestAnimationFrame(() =>
      promptInputRef.current?.focus?.(),
    );
    return () => cancelAnimationFrame(t);
  }, [dialog]);

  useEffect(() => {
    if (!dialog) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (dialog.kind === "confirm") {
          dialog.resolve(false);
          dismiss();
        } else if (dialog.kind === "prompt") {
          dialog.resolve(null);
          dismiss();
        } else if (dialog.kind === "alert") {
          dialog.resolve();
          dismiss();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dialog, dismiss]);

  const handleBackdropCancel = () => {
    if (!dialog) return;
    if (dialog.kind === "confirm") dialog.resolve(false);
    else if (dialog.kind === "prompt") dialog.resolve(null);
    else if (dialog.kind === "alert") dialog.resolve();
    dismiss();
  };

  const handleDeleteRepository = async (repository) => {
    if (!repository?._id) return;

    const confirmed = await confirmModal({
      variant: "danger",
      title: "Delete repository?",
      message: `Remove “${repository.name}”? This cannot be undone.`,
      confirmLabel: "Continue",
      cancelLabel: "Cancel",
    });
    if (!confirmed) return;

    const typed = await promptModal({
      title: "Confirm name",
      message: `Type the repository name exactly.`,
      placeholder: repository.name,
    });

    if (typed === null) return;
    if (typed.trim() !== repository.name) {
      await alertModal({
        variant: "warning",
        title: "Not deleted",
        message: "The name didn’t match. Nothing was deleted.",
      });
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/repo/delete/${repository._id}`,
      );
      await alertModal({
        variant: "success",
        title: "Removed",
        message:
          response.data?.message ??
          `"${repository.name}" was deleted successfully.`,
      });
      setRepositories((prev) =>
        prev.filter(
          (repo) => String(repo._id) !== String(repository._id),
        ),
      );
    } catch (err) {
      console.error("Error while deleting repository: ", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      await alertModal({
        variant: "danger",
        title: "Deletion failed",
        message:
          typeof msg === "string"
            ? msg
            : "Something went wrong while deleting.",
      });
    }
  };

  useEffect(() => {
    const fetchRepos = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/repo/user/${userId}`,
        );
        setRepositories(response.data.repositories ?? []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const variantAccent = (v) => {
    if (v === "danger")
      return {
        ring: "ring-red-500/30",
        title: "text-red-300",
        primary:
          "bg-red-600 hover:bg-red-500 focus-visible:ring-red-400/80",
      };
    if (v === "warning")
      return {
        ring: "ring-amber-500/25",
        title: "text-amber-200",
        primary:
          "bg-amber-600 hover:bg-amber-500 focus-visible:ring-amber-400/80",
      };
    if (v === "success")
      return {
        ring: "ring-emerald-500/25",
        title: "text-emerald-300",
        primary:
          "bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-emerald-400/80",
      };
    return {
      ring: "ring-blue-500/25",
      title: "text-blue-200",
      primary: "bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-400/80",
    };
  };

  const renderDialog = () => {
    if (!dialog) return null;
    const acc = variantAccent(dialog.variant);

    return (
      <div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]"
        role="presentation"
        onClick={handleBackdropCancel}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="repo-dialog-title"
          className={`w-full max-w-md rounded-2xl border border-gray-700/90 bg-[#161b22] p-6 shadow-2xl ring-1 ring-inset ${acc.ring}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            id="repo-dialog-title"
            className={`text-lg font-semibold tracking-tight ${acc.title}`}
          >
            {dialog.title}
          </h2>

          {dialog.kind !== "prompt" ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
              {dialog.message}
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {dialog.message}
              </p>
              <label className="sr-only" htmlFor="repo-delete-confirm-input">
                Repository name
              </label>
              <input
                ref={promptInputRef}
                id="repo-delete-confirm-input"
                type="text"
                value={promptDraft}
                placeholder={dialog.placeholder}
                autoComplete="off"
                onChange={(e) => setPromptDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    dialog.resolve(promptDraft);
                    dismiss();
                  }
                }}
                className="mt-4 w-full rounded-lg border border-gray-600 bg-[#0d1117] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            {dialog.kind !== "alert" ? (
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 sm:mr-auto sm:justify-self-start"
                onClick={() => {
                  if (dialog.kind === "confirm") dialog.resolve(false);
                  else dialog.resolve(null);
                  dismiss();
                }}
              >
                {dialog.cancelLabel ?? "Cancel"}
              </button>
            ) : null}

            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161b22] ${acc.primary} ${dialog.kind === "alert" ? "w-full sm:w-auto" : ""}`}
              onClick={() => {
                if (dialog.kind === "confirm") dialog.resolve(true);
                else if (dialog.kind === "prompt") {
                  dialog.resolve(promptDraft);
                } else dialog.resolve();
                dismiss();
              }}
            >
              {dialog.kind === "alert"
                ? "OK"
                : dialog.kind === "prompt"
                  ? "Delete"
                  : dialog.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        {renderDialog()}
        <div className="rounded-xl border border-gray-800 bg-[#0d1117] px-6 py-12 text-center text-sm text-gray-400">
          Loading repositories…
        </div>
      </>
    );
  }

  return (
    <>
      {renderDialog()}
      <div className="rounded-xl border border-gray-800 bg-[#0d1117] p-4 sm:p-6">
        <h3 className="mb-4 text-base font-semibold text-[#c9d1d9]">
          Your repositories
        </h3>

        {repositories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
            <FaRegFaceSadCry className="h-10 w-10 opacity-80" aria-hidden />
            <p>No repositories found</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#30363d]">
            {repositories.map((repository) => (
              <li
                key={repository._id}
                className="group py-4 first:pt-0 focus-within:bg-[#161b22]/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-semibold text-[#58a6ff]">
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
                    {repository.visibility != null && (
                      <span className="mt-2 inline-block rounded-full border border-gray-600 px-2 py-0.5 text-xs text-gray-500">
                        {repository.visibility}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label={`Delete ${repository.name}`}
                    onClick={() => handleDeleteRepository(repository)}
                    className="shrink-0 rounded-md p-2 text-red-500 opacity-100 transition-opacity duration-150 hover:bg-red-500/10 hover:text-red-400 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500/60 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  >
                    <MdDeleteOutline className="h-6 w-6" aria-hidden />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Repositories;
