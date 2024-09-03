import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = { notifications: [] };

export const getNotification = createAsyncThunk("notifications/get", async () => {
  const res = await axios.get("/api/notification");
  return res.data;
});

export const deleteNotification = createAsyncThunk("notifications/delete", async (id) => {
  const res = await axios.post("/api/notification/delete", { id });
  return res.data;
});

export const deleteAllNotification = createAsyncThunk("notifications/delete-all", async () => {
  const res = await axios.post("/api/notification/delete-all");
  return res.data;
});

export const createNotification = createAsyncThunk("notifications/add", async (notification) => {
  const res = await axios.post("/api/notification/add", { notification });
  return res.data;
});

const notificationSlice = createSlice({
  initialState,
  name: "notifications",
  extraReducers: (builder) => {
    builder
      .addCase(getNotification.fulfilled, (state, actions) => {
        state.notifications = actions.payload;
      })
      .addCase(deleteNotification.fulfilled, (state, actions) => {
        state.notifications = actions.payload;
      })
      .addCase(deleteAllNotification.fulfilled, (state, actions) => {
        state.notifications = actions.payload;
      })
      .addCase(createNotification.fulfilled, (state, actions) => {
        state.notifications = actions.payload;
      });
  },
});

export const notificationReducer = notificationSlice.reducer;
