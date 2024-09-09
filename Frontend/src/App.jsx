import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <UserContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login-success/:userId" element={<LoginSuccess />} />
              <Route path="/login" element={<Form type="login" />} />
              <Route path="/register" element={<Form type="register" />} />
              <Route element={<Container></Container>}>
                <Route path="/" element={<Homepage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/product/category/:categoryId"
                  element={<ProductsPage />}
                />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route element={<Profile></Profile>}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/order" element={<OrderInfo />} />
                  <Route
                    path="/transactions"
                    element={<TransactionHistory />}
                  />
                  <Route path="/topup" element={<Topup />} />
                </Route>
              </Route>

              <Route element={<AdminContainer></AdminContainer>}>
                <Route path="/admin/" element={<AdminHome />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/products" element={<AdminProductPage />} />
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
            </Routes>
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
          </BrowserRouter>
        </UserContextProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
