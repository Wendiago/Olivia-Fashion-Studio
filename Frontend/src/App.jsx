import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import {
  Homepage,
  ProductsPage,
  ProductDetail,
  Cart,
  Payment,
  Profile,
  SearchPage,
  AdminHome,
  AdminOrders,
  AdminCategories,
  AdminManagement,
  AdminProductPage,
  AdminProductCategory,
  AdminSearch,
  AdminTransaction,
} from "./pages";
import { UserContextProvider } from "./context/context";
import { AuthProvider } from "./context/AuthContext";
import {
  Container,
  Form,
  AdminContainer,
  LoginSuccess,
  ProfilePage,
  OrderInfo,
  TransactionHistory,
  Topup,
} from "./components";
import store from "./store/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <UserContextProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login-success/:userId" element={<LoginSuccess />} />
              <Route path="/login" element={<Form type="login" />} />
              <Route path="/register" element={<Form type="register" />} />

              {/* Customer Routes */}
              <Route element={<Container />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/product/category/:categoryId"
                  element={<ProductsPage />}
                />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />

                {/* Protected Routes for Customer Profile */}
                <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                  <Route element={<Profile />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/order" element={<OrderInfo />} />
                    <Route
                      path="/transactions"
                      element={<TransactionHistory />}
                    />
                    <Route path="/topup" element={<Topup />} />
                  </Route>
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route element={<AdminContainer />}>
                  <Route path="/admin/" element={<AdminHome />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route
                    path="/admin/categories"
                    element={<AdminCategories />}
                  />
                  <Route
                    path="/admin/products"
                    element={<AdminProductPage />}
                  />
                  <Route path="/admin/users" element={<AdminManagement />} />
                  <Route
                    path="admin/category/:categoryId"
                    element={<AdminProductCategory />}
                  />
                  <Route path="/admin/search" element={<AdminSearch />} />
                  <Route
                    path="/admin/transaction"
                    element={<AdminTransaction />}
                  />
                </Route>
              </Route>

              {/* Redirect for undefined routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Toast Container for Notifications */}
            <div>
              <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="colored"
              />
            </div>
          </UserContextProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
