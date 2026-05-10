import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Navbar from "../common/Navbar";
import { GoFileDirectoryFill } from "react-icons/go";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdEvent } from "react-icons/md";

function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);

  const searchResults = useMemo(() => {
    const list = Array.isArray(repositories) ? repositories : [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((repo) => {
      const name = (repo?.name ?? "").toLowerCase();
      const desc = (repo?.description ?? "").toString().toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [searchQuery, repositories]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:3000/repo/user/${userId}`,
        );
        const data = response.data;
        setRepositories(Array.isArray(data.repositories) ? data.repositories : []);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/repo/all`);
        const data = res.data;
        setSuggestedRepositories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching repositories: ", err);
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  const cardClass =
    "rounded-xl border border-gray-800 bg-gray-950/60 shadow-inner backdrop-blur-sm";
  const repoRowClass =
    "group rounded-lg border border-gray-800/80 bg-gray-900/40 px-4 py-3 transition-colors hover:border-gray-700 hover:bg-gray-900/70";

  return (
    <Navbar>
      <main className="flex-1 bg-gray-900 text-white">
        <div className="mx-auto w-full max-w-[min(1680px,calc(100vw-24px))] px-3 py-8 sm:px-4 lg:px-6">
          <header className="mb-8 border-b border-gray-800 pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              Explore suggested repositories, manage yours, and browse upcoming
              events.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-6 2xl:gap-8">
            {/* Suggested */}
            <aside className="order-2 xl:order-1 xl:col-span-3">
              <div className={`${cardClass} overflow-hidden`}>
                <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-950/80 px-4 py-3">
                  <HiOutlineSparkles className="h-5 w-5 text-amber-400/90" aria-hidden />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
                    Suggested
                  </h2>
                </div>
                <div className="max-h-[min(520px,65vh)] overflow-y-auto p-3 [scrollbar-width:thin] [scrollbar-color:rgba(75,85,99,0.6)_transparent]">
                  {suggestedRepositories.length === 0 ? (
                    <p className="px-2 py-8 text-center text-sm text-gray-500">
                      Nothing to suggest yet.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {suggestedRepositories.map((repo) => (
                        <li key={repo._id ?? repo.name}>
                          <div className={`${repoRowClass} cursor-default`}>
                            <div className="flex items-start gap-2">
                              <GoFileDirectoryFill
                                className="mt-0.5 h-4 w-4 shrink-0 text-blue-400/80"
                                aria-hidden
                              />
                              <div className="min-w-0">
                                <p className="truncate font-medium text-[#58a6ff]">
                                  {repo.name}
                                </p>
                                {repo.description ? (
                                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                                    {repo.description}
                                  </p>
                                ) : (
                                  <p className="mt-1 text-xs italic text-gray-600">
                                    No description
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </aside>

            {/* Your repositories */}
            <section className="order-1 min-w-0 xl:order-2 xl:col-span-6">
              <div className={`${cardClass} overflow-hidden`}>
                <div className="flex flex-col gap-3 border-b border-gray-800 bg-gray-950/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <GoFileDirectoryFill
                      className="h-5 w-5 text-blue-400"
                      aria-hidden
                    />
                    <h2 className="text-lg font-semibold text-white">
                      Your repositories
                    </h2>
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400">
                      {searchResults.length}
                    </span>
                  </div>
                  <div className="relative sm:max-w-xs sm:flex-1 xl:max-w-[280px]">
                    <label htmlFor="dash-repo-search" className="sr-only">
                      Search your repositories
                    </label>
                    <input
                      id="dash-repo-search"
                      type="search"
                      value={searchQuery}
                      placeholder="Search by name or description…"
                      autoComplete="off"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2 pl-3 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4">
                  {searchResults.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-700 py-16 text-center">
                      <p className="text-sm text-gray-500">
                        {repositories.length === 0
                          ? "You have no repositories yet. Create one from the navbar."
                          : "No repositories match your search."}
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {searchResults.map((repo) => (
                        <li key={repo._id ?? repo.name}>
                          <article className={repoRowClass}>
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="flex min-w-0 items-start gap-3">
                                <span className="mt-0.5 rounded-md bg-gray-800 p-2">
                                  <GoFileDirectoryFill
                                    className="h-4 w-4 text-blue-400"
                                    aria-hidden
                                  />
                                </span>
                                <div className="min-w-0">
                                  <h3 className="truncate text-base font-semibold text-white">
                                    {repo.name}
                                  </h3>
                                  {repo.description ? (
                                    <p className="mt-1 text-sm text-gray-400">
                                      {repo.description}
                                    </p>
                                  ) : (
                                    <p className="mt-1 text-sm italic text-gray-600">
                                      No description
                                    </p>
                                  )}
                                </div>
                              </div>
                              {repo.visibility != null && (
                                <span className="shrink-0 rounded-md border border-gray-600 px-2 py-1 text-xs capitalize text-gray-400">
                                  {String(repo.visibility)}
                                </span>
                              )}
                            </div>
                          </article>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {/* Events */}
            <aside className="order-3 xl:col-span-3">
              <div className={`${cardClass} overflow-hidden`}>
                <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-950/80 px-4 py-3">
                  <MdEvent className="h-5 w-5 text-emerald-400/90" aria-hidden />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
                    Upcoming events
                  </h2>
                </div>
                <ul className="divide-y divide-gray-800/80 p-2">
                  <li>
                    <a
                      className="block rounded-lg px-3 py-3 text-sm text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-[#58a6ff]"
                      href="https://www.expresscomputer.in/event/bfsi-tech-conclave-2026-19th-20th-june-2026/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      BFSI Tech Conclave 2026 · 19–20 June 2026
                    </a>
                  </li>
                  <li>
                    <a
                      className="block rounded-lg px-3 py-3 text-sm text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-[#58a6ff]"
                      href="https://conference.csteachers.org/event/CSTA2026/summary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      CSTA 2026 Annual Conference
                    </a>
                  </li>
                  <li>
                    <a
                      className="block rounded-lg px-3 py-3 text-sm text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-[#58a6ff]"
                      href="https://www.uteachcs.org/weteach-cs-summit/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      WeTeach_CS Summit 2026
                    </a>
                  </li>
                  <li>
                    <a
                      className="block rounded-lg px-3 py-3 text-sm text-gray-300 transition-colors hover:bg-gray-800/50 hover:text-[#58a6ff]"
                      href="https://www.panoramaed.com/blog/ai-in-education-conferences-2026"
                      target="_blank"
                      rel="noreferrer"
                    >
                      ISTELive 2026
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </Navbar>
  );
}

export default Dashboard;
