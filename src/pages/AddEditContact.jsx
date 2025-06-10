import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addContact,
  updateContact,
} from "../features/contacts/contactSlice.js";
import { storage, ID } from "../lib/appwrite.js";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

function AddEditContact() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.contacts.loading);
  const contacts = useSelector((state) => state.contacts.contacts);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const error = useSelector((state) => state.contacts.error);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (id) {
      const contactToEdit = contacts.find((contact) => contact.$id === id);
      if (contactToEdit) {
        setName(contactToEdit.name);
        setPhone(contactToEdit.phone);
        setGender(contactToEdit.gender);
        setAddress(contactToEdit.address);
        setImageUrl(contactToEdit.imageUrl);
      } else {
        toast.error("Contact not found");
      }
    }
  }, [id, contacts]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      console.log(
        "No new image file selected, returning existing URL:",
        imageUrl
      );
      return imageUrl;
    }
    const APPWRITE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
    if (!APPWRITE_BUCKET_ID) {
      console.error("VITE_APPWRITE_BUCKET_ID is not defined.");
      toast.error("Image upload failed: Appwrite Bucket ID is missing.");
      return null;
    }
    try {
      const file = await storage.createFile(
        APPWRITE_BUCKET_ID,
        ID.unique(),
        imageFile
      );
      const preview = storage.getFilePreview(APPWRITE_BUCKET_ID, file.$id);
      return await preview.href;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authStatus || !userData?.$id) {
      toast.error("You must be logged in to perform this action.");
      return;
    }
    const userId = userData.$id;
    let uploadedImageUrl = imageUrl;
    if (imageFile) {
      uploadedImageUrl = await uploadImage();
      if (uploadedImageUrl === null) {
        // If image upload failed, stop the process
        console.log("Image upload failed, stopping form submission.");
        return;
      }
    }
    const contactData = {
      name,
      address,
      phone,
      gender,
      imageUrl: uploadedImageUrl,
    };
    let resultAction;
    if (id) {
      resultAction = await dispatch(
        updateContact({ contactId: id, updatedData: contactData })
      );
      if (updateContact.fulfilled.match(resultAction)) {
        toast.success("Contact updated successfully!");
        navigate("/contacts");
      } else {
        toast.error(
          `Failed to update contact: ${
            resultAction.error?.message || "Unknown error"
          }`
        );
      }
    } else resultAction = await dispatch(addContact(contactData, userId));
    if (addContact.fulfilled.match(resultAction)) {
      toast.success("Contact added successfully!");
      navigate("/contacts");
    } else {
      toast.error(
        `Failed to add contact: ${
          resultAction.error?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-800 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {id ? "Edit Contact" : "Add New Contact"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col items-start">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Contact Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 flex flex-col items-start">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 flex flex-col items-start">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="contactNumber"
          >
            Contact Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            id="contactNumber"
            type="text"
            placeholder="Contact Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 flex flex-col items-start">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="gender"
          >
            Gender
          </label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4 flex flex-col items-start">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="image"
          >
            Image
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imageUrl && !imageFile && (
            <p className="text-gray-500 text-xs mt-2">
              Current Image:{" "}
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Image
              </a>
            </p>
          )}
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading
              ? id
                ? "Updating..."
                : "Adding..."
              : id
              ? "Update Contact"
              : "Add Contact"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/contacts")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEditContact;
