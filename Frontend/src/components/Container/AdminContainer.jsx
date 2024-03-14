import { AdminHeader, Footer } from "../../components";
const Container = ({ children }) => {
  return (
    <div className="divide-y flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex-1 bg-grey-100">{children}</div>
      <Footer />
    </div>
  );
};

export default Container;
