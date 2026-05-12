import React from "react";
import Navbar from "../common/Navbar";
import { GrOverview, GrStar } from "react-icons/gr";
import { GoFileDirectoryFill } from "react-icons/go";
import avatar from "../../assets/avatar.avif";
import { useState, useEffect } from "react";
import axios from "axios";
import HeatMap from "./heatMap";
import Repositories from "./Repositories";
import StarredRepositories from "./StarredRepositories";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import { API_BASE_URL } from "../../config/api";

function Profile() {
  const { setCurrentUser } = useAuth();

  //handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
  };

  const [activeTab, setActiveTab] = useState("overview"); // overview | repositories | starred

  const [userDetails, setUserDetails] = useState({
    username: "Username",
  });

  const tabBase =
    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900";
  const tabInactive = "text-gray-400 hover:bg-gray-800/80 hover:text-white cursor-pointer";
  const tabActive =
    "text-white ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 cursor-pointer";

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/userProfile/${userId}`,
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Error fetching user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <Navbar>
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col bg-gray-900 text-white">
        {/* Tabs /second navbar*/}
        <div className="border-b border-gray-800 bg-gray-950/40">
          <div className="mx-auto flex w-full max-w-[min(1680px,calc(100vw-24px))] flex-row flex-wrap items-center gap-3 px-3 py-3 sm:px-4 lg:px-6">
            <div className="flex min-w-0 flex-1 flex-row flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`${tabBase} ${activeTab === "overview" ? tabActive : tabInactive}`}
              >
                <GrOverview className="h-4 w-4 opacity-90" aria-hidden />
                Overview
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("repositories")}
                className={`${tabBase} ${activeTab === "repositories" ? tabActive : tabInactive}`}
              >
                <GoFileDirectoryFill className="h-4 w-4 opacity-90" aria-hidden />
                Repositories
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("starred")}
                className={`${tabBase} ${activeTab === "starred" ? tabActive : tabInactive}`}
              >
                <GrStar className="h-4 w-4 opacity-90" aria-hidden />
                Starred Repositories
              </button>
            </div>

            <div className="ml-auto flex shrink-0 items-center">
              <Link
                to="/auth"
                onClick={handleLogout}
                className="text-sm hover:border-2 rounded-lg px-3 py-1 hover:bg-blue-500  font-medium text-white hover:text-gray-300 "
              >
                Logout
              </Link>
            </div>
          </div>
        </div>

        {/* Main: profile column + heatmap on the right */}
        <div className="mx-auto mt-10 w-full max-w-[min(1680px,calc(100vw-24px))] flex-1 px-3 py-8 sm:px-4 lg:px-6">
          <div className="flex flex-col gap-10 2xl:flex-row 2xl:gap-12">
            <aside className="flex shrink-0 flex-col items-center border-b border-gray-800 pb-8 2xl:w-72 2xl:border-b-0 2xl:border-r 2xl:border-gray-800 2xl:pb-0 2xl:pr-8 2xl:pt-2">
              <img
                src={avatar}
                alt=""
                className="h-40 w-40 shrink-0 rounded-full border-4 border-white object-cover shadow-xl ring-2 ring-gray-800 sm:h-44 sm:w-44"
              />

              <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">
                {userDetails.username}
              </h2>

              <button
                type="button"
                className="mt-4 w-full max-w-[200px] rounded-md border border-gray-600 bg-gray-800 py-2 text-sm font-semibold text-white transition-colors hover:border-gray-500 hover:bg-gray-700"
              >
                Follow
              </button>

              <div className="mt-6 flex w-full max-w-[220px] justify-center gap-6 text-sm text-gray-400">
                <div className="text-center">
                  <div className="font-semibold text-white">100</div>
                  <div>Followers</div>
                </div>
                <div className="h-10 w-px self-center bg-gray-800" />
                <div className="text-center">
                  <div className="font-semibold text-white">100</div>
                  <div>Following</div>
                </div>
              </div>
            </aside>

            <section className="min-w-0 w-full flex-1 2xl:pt-2">
              {activeTab === "overview" && (
                <>
                  <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-4 shadow-inner sm:p-5 xl:p-6">
                    <HeatMap />
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    Contribution activity is shown for the last year. Calendar is
                    based on local activity data.
                  </p>
                </>
              )}

              {activeTab === "repositories" && <Repositories />}

              {activeTab === "starred" && (
                <StarredRepositories />
              )}
            </section>
          </div>
        </div>
      </div>
    </Navbar>
  );
}

export default Profile;
