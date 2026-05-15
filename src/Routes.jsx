import React , {useState , useEffect } from 'react'
import {useNavigate , useRoutes} from 'react-router-dom';
// pages list
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Navbar from "./components/common/Navbar";
import NewRepository from "./components/repo/newRepository";
import RepoCommands from "./components/repo/repoCommands";
import RepositoryDetail from "./components/repo/RepositoryDetail";

// auth context
import { useAuth } from './authContext';

const ProjectRoutes = () => {
    // Extract currentUser and setCurrentUser from custom auth context
    const {currentUser , setCurrentUser} = useAuth();
    const navigate = useNavigate(); 

    useEffect(() => {
        // Get userId from localStorage (persisted login state)
        const userIdFromStorage = localStorage.getItem("userId");

        // If userId exists in localStorage but not in context, update context
        if(userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage);
        }

        // If no userId and user tries to access a protected route, redirect to login
        if(!userIdFromStorage && !["/auth" , "/signup"].includes(window.location.pathname)) {
            navigate("/auth");
        }

        // If userId exists but they are on the login page, redirect to dashboard
        if(userIdFromStorage && window.location.pathname === "/auth") {
            navigate("/");
        }

    } , [currentUser , navigate , setCurrentUser ]);

    // Define application routes
    let element = useRoutes([
        { path : "/", element : <Dashboard/>},   // Dashboard route
        { path : "/auth", element : <Login /> }, // Login route
        { path : "/signup" , element : <Signup />}, // Signup route
        { path : "/profile" , element : <Profile />}, // Profile route
        {
            path: "/repo/create",
            element: (
                <Navbar>
                    <NewRepository />
                </Navbar>
            ),
        },
        {
            path : "/repo/commands",
            element : (
                <Navbar>
                    <div className="bg-gray-900 px-3 py-8 sm:px-4 lg:px-6">
                        <RepoCommands />
                    </div>
                </Navbar>
            ),
        },
        {
            path: "/repo/:id",
            element: (
                <Navbar>
                    <div className="bg-gray-900 px-3 py-8 sm:px-4 lg:px-6">
                        <RepositoryDetail />
                    </div>
                </Navbar>
            ),
        },
    ]);

    // Render the matched route element
    return element;
}

export default ProjectRoutes;
