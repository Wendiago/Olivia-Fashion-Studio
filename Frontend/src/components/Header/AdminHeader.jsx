import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Cart,
  Logo,
  Profile,
  Category,
  ProductManagement,
  Order,
  Transaction
} from "../../assets/icons";
import { useAuth } from "../../context/AuthContext";
import AuthApi from "../../api/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [keyword, setKeyWord] = useState("");
  const handleSearchKeyWord = (e) => {
    e.preventDefault();
    setKeyWord(e.target.value);
  };
  const handleLogOut = async () => {
    const response = await AuthApi.logout();
    console.log(response);
    if (response?.status === 200) {
      toast.success("Log out successful");
      logout();
      navigate("/login");
    } else {
      toast.error(response.data.message);
    }
  };
  return (
    <div className="h-[86px] sticky">
      <div
        className="max-w-[1200px]  flex justify-between"
        style={{ margin: "0 auto" }}
      >
        <NavLink to="/admin/" className="w-[86px] h-auto">
          <Logo className="h-[86px] w-auto" />
        </NavLink>

        <div className="flex">
          <div className="flex">
            <NavLink
              className="group mr-[18px] flex flex-col items-center justify-center gap-1"
              to="/admin/categories"
            >
              <Category className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
              <p className="font-body text-xs text-dark group-hover:text-grey-500">
                Categories
              </p>
            </NavLink>
            <NavLink
              className="group mr-[18px] flex flex-col items-center justify-center gap-1"
              to="/admin/products"
            >
              <ProductManagement className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
              <p className="font-body text-xs text-dark group-hover:text-grey-500">
                Products
              </p>
            </NavLink>
            <NavLink
              className="group mr-[18px] flex flex-col items-center justify-center gap-1"
              to="/admin/orders"
            >
              <Order className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
              <p className="font-body text-xs text-dark group-hover:text-grey-500">
                Orders
              </p>
            </NavLink>
            <NavLink
              className="group mr-[18px] flex flex-col items-center justify-center gap-1"
              to="/admin/users"
            >
              <Profile className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
              <p className="font-body text-xs text-dark group-hover:text-grey-500">
                Accounts
              </p>
            </NavLink>
            <NavLink
              className="group mr-[30px] flex flex-col items-center justify-center gap-1"
              to="/admin/transaction"
            >
              <Transaction className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
              <p className="font-body text-xs text-dark group-hover:text-grey-500">
                Transaction
              </p>
            </NavLink>
            {user.isAuthenticated && (
              <NavLink
                className="group mr-[18px] flex flex-col items-center justify-center gap-1"
                onClick={handleLogOut}
              >
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  className="text-[20px] group-hover:text-grey-500"
                />
                <p className="font-body text-xs text-dark group-hover:text-grey-500">
                  Log out
                </p>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
