import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const authStatus = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="container mx-auto p-4 text-center bg-gray-800 rounded-2xl">
      <h1 className="text-3xl font-bold mb-4">Welcome to Contact Manager</h1>
      {!authStatus ? (
        <p className="text-lg mb-4">
          Please{" "}
          <Link className="text-blue-500 hover:underline" to="/login">
            login
          </Link>{" "}
          or{" "}
          <Link className="text-blue-500 hover:underline" to="/register">
            register
          </Link>
          to manage your contacts"
        </p>
      ) : (
        <p>
          Hello, {user?.name || "User"} Go to{" "}
          <Link className="text-blue-500 hover:underline" to="/contacts">
            Contacts
          </Link>
          to manage your contacts
        </p>
      )}
    </div>
  );
}

export default Home;
