import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Cart, Logo, Profile } from "../../assets/icons";
import { useAuth } from "../../context/AuthContext";
import AuthApi from "../../api/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { itemsCount, fetchCart } from "../../store/CartSlice/CartSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemCount = useSelector(itemsCount);
  //console.log(cartItemCount);
  const { user, logout } = useAuth();
  const [keyword, setKeyWord] = useState("");

  useEffect(() => {
    dispatch(fetchCart());
  }, []);
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
  const handleOnCartClick = (e) => {
    e.preventDefault();
    if (!user.isAuthenticated) {
      toast.error("Please login first");
    } else {
      console.log(user._id);
      navigate(`/cart`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate({
        pathname: "/search",
        search: `?search=${keyword}`,
      });
    }
  };
  return (
    <div className="h-[86px] sticky">
      <div
        className="max-w-[1200px]  flex justify-between"
        style={{ margin: "0 auto" }}
      >
        <NavLink to="/" className="w-[86px] h-auto">
          <Logo className="h-[86px] w-auto" />
        </NavLink>

        <div className="flex items-center">
          <input
            className="w-[500px] h-[40px] p-[15px] border-2 rounded-l-lg border-primary outline-none"
            name="searchbar"
            id="searchbar"
            type="text"
            placeholder="Search"
            onChange={(e) => handleSearchKeyWord(e)}
            onKeyDown={handleKeyPress}
          ></input>
          <NavLink
            to={{
              pathname: "/search",
              search: `?search=${keyword}`,
            }}
            className="bg-primary h-[42px] pt-2 pb-2 pl-4 pr-4 border rounded-r-lg -ml-[2px] cursor-pointer hover:opacity-80"
          >
            <p className="font-body text-[16px] text-white text-center">
              Search
            </p>
          </NavLink>
        </div>
        <div className="flex">
          <NavLink
            className="mr-[30px] group flex flex-col items-center justify-center gap-1"
            onClick={handleOnCartClick}
          >
            <Cart className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500 relative" />
            {cartItemCount !== 0 && (
              <p className="cart-noti absolute bg-red border rounded-[50%] top-[10%] translate-x-[70%] w-[25px] h-[25px] flex items-center justify-center">
                <span className="text-white text-[14px]">{cartItemCount}</span>
              </p>
            )}

            <p className="font-body text-xs text-dark group-hover:text-grey-500">
              My cart
            </p>
          </NavLink>
          {user.isAuthenticated && (
            <NavLink
              className="group mr-[30px] flex flex-col items-center justify-center gap-1"
              to="/profile"
            >
              <Profile className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
              <p className="font-body text-xs text-dark group-hover:text-grey-500">
                Profile
              </p>
            </NavLink>
          )}

          {!user.isAuthenticated && (
            <>
              <NavLink
                className="group flex items-center justify-center"
                to="/login"
              >
                <p className="font-body text-xs text-dark group-hover:text-grey-500">
                  Log in
                </p>
                <div className="after:ml-[9px] after:border-[1px] after:border-grey-400 after:inline-block after:h-[13px]"></div>
              </NavLink>
              <NavLink
                className="group ml-[9px] flex flex-col items-center justify-center"
                to="/register"
              >
                <p className="font-body text-xs text-dark group-hover:text-grey-500">
                  Register
                </p>
              </NavLink>
            </>
          )}
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
  );
};

export default Header;
