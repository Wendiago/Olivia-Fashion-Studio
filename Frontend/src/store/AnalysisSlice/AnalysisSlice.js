import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../../utils/status";
import customAxios from "../../api/customApi";

const initialState = {
  dailyRevenue: [],
  dailyRevenueStatus: STATUS.IDLE,
  weeklyRevenue: [],
  weeklyRevenueStatus: STATUS.IDLE,
  monthlyRevenue: [],
  monthlyRevenueStatus: STATUS.IDLE,
  topSelling: [],
  topSellingStatus: STATUS.IDLE,
  totalRevenue: 0,
  totalRevenueStatus: STATUS.IDLE,
  orderCount: 0,
  orderCountStatus: STATUS.IDLE,
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyRevenue.pending, (state, action) => {
        state.dailyRevenueStatus = STATUS.LOADING;
      })

      .addCase(fetchDailyRevenue.fulfilled, (state, action) => {
        state.dailyRevenue = action.payload.data;
        state.dailyRevenueStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchDailyRevenue.rejected, (state, action) => {
        state.dailyRevenueStatus = STATUS.FAILED;
      })
      
      .addCase(fetchWeeklyRevenue.pending, (state, action) => {
        state.weeklyRevenueStatus = STATUS.LOADING;
      })

      .addCase(fetchWeeklyRevenue.fulfilled, (state, action) => {
        state.weeklyRevenue = action.payload.data;
        state.weeklyRevenueStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchWeeklyRevenue.rejected, (state, action) => {
        state.weeklyRevenueStatus = STATUS.FAILED;
      })

      .addCase(fetchMonthlyRevenue.pending, (state, action) => {
        state.monthlyRevenueStatus = STATUS.LOADING;
      })

      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.monthlyRevenue = action.payload.data;
        state.monthlyRevenueStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.monthlyRevenueStatus = STATUS.FAILED;
      })
      
      .addCase(fetchTopSellingProducts.pending, (state, action) => {
        state.topSellingStatus = STATUS.LOADING;
      })

      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.topSelling = action.payload.data;
        state.topSellingStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.topSellingStatus = STATUS.FAILED;
      })
      
      .addCase(fetchTotalRevenue.pending, (state, action) => {
        state.totalRevenueStatus = STATUS.LOADING;
      })

      .addCase(fetchTotalRevenue.fulfilled, (state, action) => {
        state.totalRevenue = action.payload.totalRevenue;
        state.totalRevenueStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchTotalRevenue.rejected, (state, action) => {
        state.totalRevenueStatus = STATUS.FAILED;
      })
      
      .addCase(fetchTotalOrder.pending, (state, action) => {
        state.orderCountStatus = STATUS.LOADING;
      })

      .addCase(fetchTotalOrder.fulfilled, (state, action) => {
        state.orderCount = action.payload.data;
        state.orderCountStatus = STATUS.SUCCEEDED;
      })

      .addCase(fetchTotalOrder.rejected, (state, action) => {
        state.orderCountStatus = STATUS.FAILED;
      });
  },
});

export const fetchDailyRevenue = createAsyncThunk(
  "daily-revenue/fetch",
  async () => {
    const response = await customAxios.get(`/admin/analysis/daily-revenue`);
    console.log(response)
    return response.data;
  }
);

export const fetchWeeklyRevenue = createAsyncThunk(
    "weekly-revenue/fetch",
    async () => {
      const response = await customAxios.get(`/admin/analysis/weekly-revenue`);
      console.log(response)
      return response.data;
    }
);

export const fetchMonthlyRevenue = createAsyncThunk(
    "monthly-revenue/fetch",
    async () => {
      const response = await customAxios.get(`/admin/analysis/monthly-revenue`);
      console.log(response)
      return response.data;
    }
);

export const fetchTopSellingProducts = createAsyncThunk(
    "topselling/fetch",
    async () => {
      const response = await customAxios.get(`/admin/analysis/topselling`);
      console.log(response)
      return response.data;
    }
);

export const fetchTotalRevenue = createAsyncThunk(
    "total-revenue/fetch",
    async () => {
      const response = await customAxios.get(`/admin/analysis/total-revenue`);
      console.log(response)
      return response.data;
    }
);

export const fetchTotalOrder = createAsyncThunk(
    "total-order/fetch",
    async () => {
      const response = await customAxios.get(`/admin/analysis/total-order`);
      console.log(response)
      return response.data;
    }
);

export const getDailyRevenue = (state) => state.analysis.dailyRevenue;
export const getDailyRevenueStatus = (state) => state.analysis.dailyRevenueStatus;
export const getWeeklyRevenue = (state) => state.analysis.weeklyRevenue;
export const getWeeklyRevenueStatus = (state) => state.analysis.weeklyRevenueStatus;
export const getMonthlyRevenue = (state) => state.analysis.monthlyRevenue;
export const getMonthlyRevenueStatus = (state) => state.analysis.monthlyRevenueStatus;
export const getTopSelling = (state) => state.analysis.topSelling;
export const getTopSellingStatus = (state) => state.analysis.topSellingStatus;
export const getTotalRevenue = (state) => state.analysis.totalRevenue;
export const getTotalRevenueStatus = (state) => state.analysis.totalRevenueStatus;
export const getTotalOrder = (state) => state.analysis.orderCount;
export const getTotalOrderStatus = (state) => state.analysis.orderCountStatus;
export default analysisSlice.reducer;
