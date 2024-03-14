import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../../utils/status";
import customAxios from "../../api/customApi";
import { toast } from "react-toastify";

const initialState = {
  itemsCount: 0,
  totalQuantity: 0,
  carts: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      console.log(action.payload.data);
      const data = action.payload.data;
      state.carts = data.items;
      state.itemsCount = data.items.length;
      //console.log(data.items.length);
      state.totalQuantity = data.items.reduce(
        (total, item) => total + item?.quantity,
        0
      );
      state.totalPrice = data.items.reduce(
        (total, item) => total + item?.quantity * item?.productId?.price,
        0
      );
    });

    builder.addCase(fetchCart.rejected, (state, action) => {
      console.log(action.error.message);
    });

    builder.addCase(addToCart.fulfilled, (state, action) => {
      console.log(action.payload.data);
      const data = action.payload.data;
      state.carts = data?.items;
      state.itemsCount = data?.items?.length;
      state.totalQuantity = data?.items.reduce(
        (total, item) => total + item?.quantity,
        0
      );
      state.totalPrice = data?.items?.reduce(
        (total, item) => total + item?.quantity * item?.productId?.price,
        0
      );
      toast.success("Add to cart successfully");
    });

    builder.addCase(addToCart.rejected, (state, action) => {
      console.log(action);
      toast.error("Fail to add to cart");
    });

    builder.addCase(updateCart.fulfilled, (state, action) => {
      //console.log(action.payload.data);
      const data = action.payload.data;
      state.carts = data?.items;
      state.itemsCount = data?.items?.length;
      state.totalQuantity = data?.items?.reduce(
        (total, item) => total + item?.quantity,
        0
      );
      state.totalPrice = data?.items?.reduce(
        (total, item) => total + item?.quantity * item?.productId?.price,
        0
      );
    });
    builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
      //console.log(action.payload.data);
      const data = action.payload.data;
      state.carts = data?.items || [];
      state.itemsCount = data?.items?.length || 0;
      state.totalQuantity =
        data?.items?.reduce((total, item) => total + item?.quantity, 0) || 0;
      state.totalPrice =
        data?.items?.reduce(
          (total, item) => total + item?.quantity * item?.productId?.price,
          0
        ) || 0;
    });
    builder.addCase(deleteCart.fulfilled, (state, action) => {
      //console.log(action.payload.data);
      state.carts = [];
      state.itemsCount = 0;
      state.totalQuantity = 0;
      state.totalPrice = 0;
    });
  },
});

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const response = await customAxios.get(`/cart/`);
  return response.data;
});

export const addToCart = createAsyncThunk("cart/add", async (product) => {
  const response = await customAxios.post(`/cart/add`, product);
  return response.data;
});

export const updateCart = createAsyncThunk("cart/update", async (product) => {
  const response = await customAxios.post(`/cart/update`, product);
  return response.data;
});

export const removeItemFromCart = createAsyncThunk(
  "cart/remove",
  async (productId) => {
    const response = await customAxios.post(`/cart/remove`, {
      productId: productId,
    });
    return response.data;
  }
);

export const deleteCart = createAsyncThunk("cart/delete", async () => {
  const response = await customAxios.post(`/cart/delete`, {});
  return response.data;
});

// Selectors
export const itemsCount = (state) => state.cart.itemsCount;
export const carts = (state) => state.cart.carts;
export const totalQuantity = (state) => state.cart.totalQuantity;
export const totalPrice = (state) => state.cart.totalPrice;

export default cartSlice.reducer;
