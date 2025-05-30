import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const navigate = useNavigate();

  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer"
          src={assets.logo}
          alt=""
        />
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/analytics"
              className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Analytics
            </Link>
            <Link
              to="/recruits"
              className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Bookmarked Resumes
            </Link>

            <p>|</p>
            <p className="max-sm:hidden">
              {user.firstName + " " + user.lastName}
            </p>
            <UserButton />
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600"
            >
              Candidate login
            </button>
            <button
              onClick={() => openSignIn()}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
            >
              Entreprise Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
