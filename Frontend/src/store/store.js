import { configureStore } from "@reduxjs/toolkit";
import ProductReducer from "./ProductSlice/ProductSlice";
import CategoryReducer from "./CategorySlice/CategorySlice";
import OrderReducer from "./OrderSlice/OrderSlide";
import AnalysisReducer from "./AnalysisSlice/AnalysisSlice";
import UserReducer from "./UsersSlice/UsersSlice";

import CartReducer from "./CartSlice/CartSlice";
const store = configureStore({
  reducer: {
    product: ProductReducer,
    category: CategoryReducer,
    order: OrderReducer,
    analysis: AnalysisReducer,
    cart: CartReducer,
    users: UserReducer
  },
});

export default store;
