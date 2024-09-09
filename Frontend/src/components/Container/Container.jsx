import { Header, Navbar, Footer } from "../../components";
import { Outlet } from "react-router-dom";
const Container = () => {
  return (
    <div className="divide-y flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <div className="flex-1 bg-grey-100">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Container;
