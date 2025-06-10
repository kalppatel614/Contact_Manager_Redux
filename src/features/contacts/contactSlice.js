// src/features/contacts/contactSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { databases, ID, Query } from "../../lib/appwrite";
import { Permission } from "appwrite";
import { Role } from "appwrite";

// Replace with your actual Appwrite database and collection IDs
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

// Async Thunks for Appwrite Database operations
export const addContact = createAsyncThunk(
  "contacts/addContact",
  async ({ contactData, userId }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required to add a contact.");
      }
      const newContact = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          ...contactData,
          userId: userId,
        },
        [
          Permission.read(Role.user(userId)),
          Permission.write(Role.user(userId)),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ]
        // {name, address, contactNumber, gender, imageUrl}
        // Add read/write permissions for the current user to the document
        // e.g., [Permission.read(Role.user('USER_ID')), Permission.write(Role.user('USER_ID'))]
        // This usually happens on the backend or in the service layer where you have current user ID
        // For simplicity in the frontend, you might need to fetch the user ID from auth state
        // or make permissions more open for now if user ID is not readily available here.
        // For a robust solution, consider server-side functions or more explicit permission handling.
      );
      return newContact;
    } catch (error) {
      console.error("Full error:", error);
      throw error;
    }
  }
);

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (userId) => {
    try {
      // Fetch contacts belonging to the logged-in user
      // This assumes your documents have a `userId` attribute or you are using
      // Appwrite's built-in document permissions.
      // For the simplest approach: Query all and filter, or query by current user's ID
      // if you stored it with the contact.
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        [
          // Example: If you saved userId as an attribute
          // Query.equal('userId', userId),
          Query.equal("userId", userId),
          Query.orderDesc("$createdAt"),
        ]
      );
      return response.documents;
    } catch (error) {
      throw error;
    }
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ contactId, updatedData }) => {
    try {
      const updatedContact = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        contactId,
        updatedData
      );
      return updatedContact;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId) => {
    try {
      await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        contactId
      );
      return contactId; // Return the ID of the deleted contact
    } catch (error) {
      throw error;
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    // You can add sync reducers here if needed
    resetContacts: (state) => {
      state.contacts = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Contact
      .addCase(addContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts.unshift(action.payload); // Add new contact to the beginning
        state.error = null;
      })
      .addCase(addContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Contacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
        state.error = null;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.contacts = [];
      })
      // Update Contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.findIndex(
          (contact) => contact.$id === action.payload.$id
        );
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(
          (contact) => contact.$id !== action.payload
        );
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetContacts } = contactSlice.actions;
export default contactSlice.reducer;
