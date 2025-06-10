import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { account } from "../../lib/appwrite";

const initialState = {
  status: false,
  userData: null,
  loading: false,
  error: null,
};

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ email, password, name }) => {
    try {
      const userAccount = await account.create(
        "unique()",
        email,
        password,
        name
      );
      if (userAccount) {
        return loginUser({ email, password });
      } else {
        throw new Error("User account not created");
      }
    } catch (error) {
      throw error;
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      return currentUser;
    } catch (error) {
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await account.deleteSession("current");
    return null;
  } catch (error) {
    throw error;
  }
});

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const currentUser = await account.get();
      return currentUser;
    } catch (error) {
      console.warn("No session found", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: null,
    status: false,
    loading: true,
    error: null,
  },
  reducers: {
    logoutUser: (state) => {
      account.deleteSession("current");
      state.userData = null;
      state.status = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.status = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.status = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = false;
        state.userData = null;
      })
      //Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userData = null;
        state.status = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //GetCurrentUser
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.status = true;
          state.userData = action.payload;
        } else {
          state.status = false;
          state.userData = null;
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = false;
        state.userData = null;
      });
  },
});

export default authSlice.reducer;
