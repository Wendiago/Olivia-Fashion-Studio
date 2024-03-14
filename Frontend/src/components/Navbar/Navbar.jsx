import { Menu } from "../../assets/icons";
import { useUserContext } from "../../context/context";
import { NavLink } from "react-router-dom";
import {
  getAllCategory,
  getAllCategoryStatus,
  fetchAsyncCategories,
} from "../../store/CategorySlice/CategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Loading } from "../../components";
import { STATUS } from "../../utils/status";
const Navbar = () => {
  const { isCategoryOpen, setCategoryOpen, categoryDropdownRef } =
    useUserContext();
  const dispatch = useDispatch();
  const categoryList = useSelector(getAllCategory);
  const categoryStatus = useSelector(getAllCategoryStatus);
  useEffect(() => {
    dispatch(fetchAsyncCategories());
  }, []);

  if (categoryStatus === STATUS.LOADING) {
    return <Loading />;
  }
  return (
    <div className="h-[56px] flex">
      <div
        className="max-w-[1200px] w-[1200px] flex"
        style={{ margin: "0 auto" }}
      >
        <div
          ref={categoryDropdownRef}
          className="relative flex items-center gap-1"
          onClick={() => {
            setCategoryOpen(!isCategoryOpen);
          }}
        >
          <Menu className="w-[24px] h-[24px] fill-dark hover:opacity-60 cursor-pointer" />
          <p className="font-body text-[16px] hover:opacity-60 cursor-pointer">
            All category
          </p>
          {isCategoryOpen && (
            <div className="absolute w-[200px] top-[45px] left-7 bg-grey-300 border rounded-b-lg">
              <div className="flex flex-col">
                {categoryList.map((category, index) => {
                  return (
                    <NavLink
                      to={`/product/category/${category?._id}`}
                      className="p-2 hover:bg-dark hover:text-white cursor-pointer"
                      key={index}
                    >
                      {category?.category}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
