import { useAuth } from "../../../context/AuthContext";
import { DefaultAvatar } from "../../../assets/imgs";
import { NavLink } from "react-router-dom";
import "./Profile.css";
const Profile = ({ children }) => {
  const { user } = useAuth();
  //console.log(user);
  return (
    user && (
      <div className="flex flex-col items-center pb-[100px]">
        <div className="max-w-[1200px] w-[1200px] grid grid-cols-[minmax(0,200px)_10fr] pt-[20px] gap-x-[28px]">
          <div className="flex flex-col">
            <div className="avatar section flex items-center gap-x-[12px] pt-[20px]">
              <img
                className="border rounded-[50%] border-grey-300 w-[50px] h-[50px]"
                src={user?.image || DefaultAvatar}
              ></img>
              <div className="font-body text-dark font-[700] ">
                {user?.username || "unknown"}
              </div>
            </div>
            <NavLink className="sidebar-option mt-[24px]" to={`/profile`}>
              <span className="font-body p">My profile</span>
            </NavLink>
            <NavLink className="sidebar-option mt-[12px]" to={`/order`}>
              <span className="font-body">My order</span>
            </NavLink>
            <NavLink className="sidebar-option mt-[12px]" to={`/transactions`}>
              <span className="font-body">My transactions</span>
            </NavLink>
            <NavLink className="sidebar-option mt-[12px]" to={`/topup`}>
              <span className="font-body">Top up</span>
            </NavLink>
          </div>
          <main className="bg-white px-[20px] border border-grey-300 shadow-sm rounded-md">
            {children}
          </main>
        </div>
      </div>
    )
  );
};

export default Profile;
