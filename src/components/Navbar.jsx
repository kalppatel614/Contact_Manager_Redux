import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

function Navbar() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4  rounded-4xl flex flec-row items-center justify-between">
      <div className="flex justify-between items-center container mx-auto w-full">
        <Link to="/" className="text-xl font-bold">
          Contact Manager
        </Link>
        <div>
          {!authStatus ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded mr-2">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded mr-2 text-white"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="mr-2">
                Welcome, {userData.name || userData.email}
              </span>
              <Link
                to="/contacts"
                className="bg-blue-200 px-4 py-2 rounded mr-2 text-white"
              >
                My Contacts
              </Link>
              <button
                className="bg-red-500 px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
