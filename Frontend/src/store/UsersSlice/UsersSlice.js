import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../../utils/status";
import customAxios from "../../api/customApi";

const initialState = {
  users: [],
  usersStatus: STATUS.IDLE,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchAsyncUsers.pending, (state) => {
            state.usersStatus = STATUS.LOADING;
        })
        .addCase(fetchAsyncUsers.fulfilled, (state, action) => {
            state.users = action.payload.data.filter(user => user.isAdmin !== true);
            state.usersStatus = STATUS.SUCCEEDED;
        })
        .addCase(fetchAsyncUsers.rejected, (state) => {
            state.usersStatus = STATUS.FAILED;
        })
        .addCase(updateAsyncUser.pending, (state) => {
            state.usersStatus = STATUS.LOADING;
        })
        .addCase(updateAsyncUser.fulfilled, (state) => {
            state.usersStatus = STATUS.SUCCEEDED;
        })
        .addCase(updateAsyncUser.rejected, (state) => {
            state.usersStatus = STATUS.FAILED;
        })
        .addCase(deleteAsyncUser.pending, (state) => {
            state.usersStatus = STATUS.LOADING;
        })
        .addCase(deleteAsyncUser.fulfilled, (state) => {
            state.usersStatus = STATUS.SUCCEEDED;
        })
        .addCase(deleteAsyncUser.rejected, (state) => {
            state.usersStatus = STATUS.FAILED;
        });
    },
});

export const fetchAsyncUsers = createAsyncThunk(
    "users/fetch", 
    async () => {
        const response = await customAxios.get(`/admin/user`);
        console.log(response)
        return response.data;
    }
);

export const updateAsyncUser = createAsyncThunk(
    "user/update",
    async ({ userId, data} ) => {
        const response = await customAxios.post(`/admin/user/update/${userId}`, data);
        return response.data;
    }
);

export const deleteAsyncUser = createAsyncThunk(
    "user/delete",
    async (userId) => {
      const response = await customAxios.get(`/admin/user/delete/${userId}`);
      return response.data;
    }
  );

export const getAllUsers = (state) => state.users.users;
export const getAllUsersStatus = (state) => state.users.usersStatus;
export default usersSlice.reducer;
