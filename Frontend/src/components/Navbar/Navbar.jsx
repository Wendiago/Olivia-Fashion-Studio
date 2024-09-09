import { Menu } from "../../assets/icons";
import { useUserContext } from "../../context/context";
import { NavLink } from "react-router-dom";
import { useAllCategories } from "../../hooks/useAllCategories";

const Navbar = () => {
  const { isCategoryOpen, setCategoryOpen, categoryDropdownRef } =
    useUserContext();
  const {
    data: categoryList = {},
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useAllCategories();
  const { data: categories = [] } = categoryList;
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
                {categories.map((category, index) => {
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
