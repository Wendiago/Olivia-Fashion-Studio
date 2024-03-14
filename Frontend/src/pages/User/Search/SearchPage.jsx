import {
  NavLink,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { formatPrice } from "../../../utils/helpers";
import Dropdown from "react-select";
import ReactPaginate from "react-paginate";
import "./SearchPage.css";
import { getAllCategory } from "../../../store/CategorySlice/CategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../../components";
import ProductApi from "../../../api/productApi";

const SearchPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const categoryList = useSelector(getAllCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [products, setProducts] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  let [searchParams, setSearchParams] = useSearchParams();

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const order = searchParams.get("order");
  const search = searchParams.get("search");

  //Get product list based on category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ProductApi.getAllProduct(
          currentPage,
          6,
          search,
          minPrice,
          maxPrice,
          order
        );
        setTotalPages(res.totalPages);
        setTotalProducts(res.totalProducts);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentPage, categoryId, searchParams]);

  //console.log(products);
  const [priceFilterError, setPriceFilterError] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const [priceSortOption, setPriceSortOption] = useState(null);
  const options = [
    { value: "asc", label: "Price: Low to high" },
    { value: "desc", label: "Price: High to low" },
  ];
  const handlePriceSortOptionChange = (selectedOption) => {
    const existingParams = {
      search: search,
    };
    if (priceRange.min !== "" && priceRange.max !== "") {
      existingParams.minPrice = priceRange.min;
      existingParams.maxPrice = priceRange.max;
    }
    setSearchParams({ ...existingParams, order: selectedOption.value });
    setPriceSortOption(selectedOption);
  };

  const handleFilterPriceRange = () => {
    const existingParams = {
      search: search,
    };
    if (priceSortOption !== null) {
      existingParams.order = priceSortOption.value;
    }
    if (priceRange.min === "" && priceRange.max === "") {
      window.scroll(0, 0);
    } else if (Number(priceRange.min) <= Number(priceRange.max)) {
      setSearchParams({
        ...existingParams,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      });
    } else {
      setPriceFilterError("Please enter a valid price range");
    }
  };

  const handleClearAll = () => {
    const existingParams = {
      search: search,
    };
    // Clear all query parameters
    setSearchParams({ search: existingParams.search });
    // Reset the price range state
    setPriceRange({ min: "", max: "" });
    // Clear any error messages
    setPriceFilterError("");
    //Clear any sort option
    setPriceSortOption(null);
  };

  const handlePriceRender = (product) => {
    if (product && product?.discountPercentage) {
      if (product.discountPercentage > 0) {
        return (
          <>
            <div className="newPrice font-body text-[16px] text-red">
              {formatPrice(
                product?.price -
                  product?.price * (product?.discountPercentage / 100)
              )}
            </div>
            <div className="oldPrice font-body line-through text-grey-800 text-[16px]">
              {formatPrice(product.price)}
            </div>
          </>
        );
      } else {
        return (
          <div className="newPrice font-body text-[16px] text-red">
            {formatPrice(product?.price)}
          </div>
        );
      }
    } else {
      return (
        <div className="newPrice font-body text-[16px] text-red">
          {formatPrice(product?.price || 0)}
        </div>
      );
    }
  };

  const handleChangeCategory = (e, id) => {
    e.preventDefault();
    navigate(`/product/category/${id}`);
  };

  return products ? (
    <div className="flex flex-col items-center pb-[100px]">
      <div className="max-w-[1200px] w-[1200px] grid grid-cols-[minmax(0,230px)_10fr] pt-[20px] gap-x-[28px]">
        <div className="Filter flex flex-col gap-y-[20px]">
          <div className="AllCategories flex flex-col border-t">
            <p className="pt-[12px] pb-[12px] font-body text-dark font-[600]">
              Category
            </p>
            {categoryList.map((category, index) => (
              <NavLink
                key={index}
                onClick={(e) => handleChangeCategory(e, category?._id)}
                className="pb-[9px] font-body text-grey-600"
              >
                {category?.category}
              </NavLink>
            ))}
          </div>
          <div className="PriceFilter flex flex-col border-t">
            <p className="pt-[12px] pb-[12px] font-body text-dark font-[600]">
              Price range
            </p>
            <div className="grid grid-cols-2 gap-x-1">
              <div className="flex flex-col">
                <label htmlFor="minInput" className="font-body">
                  Min
                </label>
                <input
                  className="p-[5px] border border-grey-300 rounded-md"
                  name="minInput"
                  placeholder="0"
                  onChange={(e) => {
                    setPriceFilterError("");
                    setPriceRange({ ...priceRange, min: e.target.value });
                  }}
                  value={priceRange.min}
                  onKeyDown={(e) => {
                    // Allow only numbers and specific keys like Backspace and Arrow keys
                    if (
                      !/[\d\bArrowUpArrowDownArrowLeftArrowRight]/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                ></input>
              </div>

              <div className="flex flex-col">
                <label htmlFor="maxInput" className="font-body">
                  Max
                </label>
                <input
                  className="p-[5px] border border-grey-300 rounded-md"
                  name="maxInput"
                  placeholder="999999999"
                  onChange={(e) => {
                    setPriceFilterError("");
                    setPriceRange({ ...priceRange, max: e.target.value });
                  }}
                  value={priceRange.max}
                  onKeyDown={(e) => {
                    // Allow only numbers and specific keys like Backspace and Arrow keys
                    if (
                      !/[\d\bArrowUpArrowDownArrowLeftArrowRight]/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                ></input>
              </div>
            </div>
            {priceFilterError && (
              <div className="pt-[10px] text-red font-body text-sm">
                {priceFilterError}
              </div>
            )}
          </div>
          <div
            className="h-[40px] w-full bg-white border border-grey-300 rounded-md 
              flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
            onClick={handleFilterPriceRange}
          >
            <span className="text-primary font-body font-[500] ">Apply</span>
          </div>

          <div
            className="h-[40px] w-full bg-primary border border-grey-300 rounded-md 
              flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
            onClick={handleClearAll}
          >
            <span className="text-white font-body font-[500] ">Clear All</span>
          </div>
        </div>
        <div className="View">
          <div className="sort-bar flex justify-between p-[20px] bg-white border border-grey-300 rounded-md shadow-sm">
            <div className="flex items-center justify-center">
              <p className="font-body">{totalProducts} items</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="font-body pr-2">Sort by</p>
              <Dropdown
                options={options}
                onChange={handlePriceSortOptionChange}
                placeholder="Price"
                value={priceSortOption}
                styles={{
                  control: (provided) => ({ ...provided, width: 200 }),
                  indicatorSeparator: () => ({ display: "none" }),
                }}
              />
            </div>
          </div>
          <div className="product-list mt-6 grid grid-cols-3 gap-[20px]">
            {products.map((product, index) => (
              <NavLink
                to={`/product/${product?._id}`}
                key={index}
                className="item-card grid grid-rows-[150px_1fr] h-[254px] 
                  border border-grey-300 shadow-md cursor-pointer transition-transform hover:scale-105"
              >
                <div className="img-container border-b-[1px] flex justify-center">
                  <img
                    className="h-full object-cover relative"
                    src={product?.image || ""}
                  />
                </div>
                <div className="p-[8px] grid grid-rows-3">
                  <div className="font-body text-[12px] font-[400] text-grey-600 overflow-hidden text-ellipsis whitespace-nowrap">
                    {product?.name || "No name"}
                  </div>
                  <div className="font-body text-[12px] font-[400] text-red self-center">
                    {product?.discountPercentage && (
                      <div className="">
                        <span className="bg-primary text-white font-body text-[12px] font-[500] border-0 rounded-md p-[4px]">
                          {product.discountPercentage}% off
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-end">
                    {handlePriceRender(product)}
                    <div className="font-body text-[12px] text-grey-500">
                      {product?.quantity ?? 0} stock
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
            <div className="mt-[20px] col-span-3">
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={(event) => {
                  setCurrentPage(event.selected + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                previousLabel="< prev"
                renderOnZeroPageCount={null}
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item prev-item"
                previousLinkClassName="page-link"
                nextClassName="page-item next-item"
                nextLinkClassName="page-link"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SearchPage;
