import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchContacts,
  deleteContact,
} from "../features/contacts/contactSlice";

function ContactList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contacts = useSelector((state) => state.contacts.contacts);
  const loading = useSelector((state) => state.contacts.loading);
  const error = useSelector((state) => state.contacts.error);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (authStatus && userData?.$id) {
      dispatch(fetchContacts(userData.$id));
    }
  }, [dispatch, authStatus, userData]);

  const handleDelete = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      await dispatch(deleteContact(contactId));
    }
  };

  const handleEdit = (contactId) => {
    navigate(`/edit-contact/${contactId}`);
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-2xl font-bold text-gray-600">
        Loading Contacts...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-2xl font-bold text-gray-600">
        Error: {error}
      </div>
    );

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contact List</h2>
        <Link
          to="/add-contact"
          className="bg-blue-200 text-white px-4 py-2 rounded hover:bg-blue-100"
        >
          Add Contact
        </Link>
      </div>
      {contacts.length === 0 ? (
        <p className="text-center mt-10 text-2xl font-bold text-gray-600">
          No contacts found
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto w-full text-sm text-left text-gray-500">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Contact Number</th>
                <th className="py-3 px-6 text-left">Gender</th>
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr
                  key={contact.$id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{contact.name}</td>
                  <td className="py-3 px-6 text-left">{contact.address}</td>
                  <td className="py-3 px-6 text-left">
                    {contact.contactNumber}
                  </td>
                  <td className="py-3 px-6 text-left">{contact.gender}</td>
                  <td className="py-3 px-6 text-left">
                    {contact.imageUrl && (
                      <img
                        src={contact.imageUrl}
                        alt="Contact"
                        className="w-12 h-12 object-cover"
                      />
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => handleEdit(contact.$id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(contact.$id)}
                        className="bg-red-500 text-white px-4 py-2 rounded}"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContactList;
