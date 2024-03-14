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
  AdminTransaction
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
              <Route
                path="/"
                element={
                  <Container>
                    <Homepage />
                  </Container>
                }
              />
              <Route
                path="/search"
                element={
                  <Container>
                    <SearchPage />
                  </Container>
                }
              />
              <Route
                path="/product/category/:categoryId"
                element={
                  <Container>
                    <ProductsPage />
                  </Container>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <Container>
                    <ProductDetail />
                  </Container>
                }
              />
              <Route
                path="/cart"
                element={
                  <Container>
                    <Cart />
                  </Container>
                }
              />
              <Route
                path="/payment"
                element={
                  <Container>
                    <Payment />
                  </Container>
                }
              />
              <Route
                path="/profile"
                element={
                  <Container>
                    <Profile>
                      <ProfilePage />
                    </Profile>
                  </Container>
                }
              />
              <Route
                path="/order"
                element={
                  <Container>
                    <Profile>
                      <OrderInfo />
                    </Profile>
                  </Container>
                }
              />
              <Route
                path="/transactions"
                element={
                  <Container>
                    <Profile>
                      <TransactionHistory />
                    </Profile>
                  </Container>
                }
              />
              <Route
                path="/topup"
                element={
                  <Container>
                    <Profile>
                      <Topup />
                    </Profile>
                  </Container>
                }
              />
              <Route
                path="/admin/"
                element={
                  <AdminContainer>
                    <AdminHome />
                  </AdminContainer>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminContainer>
                    <AdminOrders />
                  </AdminContainer>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminContainer>
                    <AdminCategories />
                  </AdminContainer>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminContainer>
                    <AdminProductPage />
                  </AdminContainer>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminContainer>
                    <AdminManagement />
                  </AdminContainer>
                }
              />
              <Route
                path="admin/category/:categoryId"
                element={
                  <AdminContainer>
                    <AdminProductCategory />
                  </AdminContainer>
                }
              />
              <Route
                path="/admin/search"
                element={
                  <AdminContainer>
                    <AdminSearch />
                  </AdminContainer>
                }
              />
              <Route
                path="/admin/transaction"
                element={
                  <AdminContainer>
                    <AdminTransaction />
                  </AdminContainer>
                }
              />
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
