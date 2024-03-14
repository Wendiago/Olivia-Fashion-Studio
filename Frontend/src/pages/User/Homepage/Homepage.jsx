import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductApi from "../../../api/productApi";
import {
  getAllCategory,
  getAllCategoryStatus,
  fetchAsyncCategories,
} from "../../../store/CategorySlice/CategorySlice";
import { STATUS } from "../../../utils/status";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import MultiCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Bolt } from "@mui/icons-material";
import { ProductCard, Loading } from "../../../components";

const Homepage = () => {
  const dispatch = useDispatch();
  const categoryList = useSelector(getAllCategory);
  const categoryListStatus = useSelector(getAllCategoryStatus);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ProductApi.getAllProduct(1, 15);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    dispatch(fetchAsyncCategories());
    fetchData();
  }, []);

  if (categoryListStatus == STATUS.LOADING) {
    return <Loading />;
  }

  const handleCategoryButtonClick = (category, index) => {
    // Update the active item index based on the clicked category
    navigate(`/product/category/${category?._id}`);
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 5, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return products ? (
    <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px]">
      <div className="max-h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
        <ul className="categoryBar p-[14px]">
          {categoryList.map((category, index) => (
            <li
              key={index}
              className="pt-3 pb-3 pl-3 pr-20 font-body text-grey-600 cursor-pointer
              hover:bg-secondary hover:text-dark hover:border-0 hover:rounded-md "
              onClick={() => handleCategoryButtonClick(category, index)}
            >
              {category?.category}
            </li>
          ))}
        </ul>
        <div className="ads flex-1">
          <Carousel
            // navButtonsAlwaysVisible={true}
            swipe={false}
            interval={5000}
            index={activeItemIndex}
            onChange={(index) => setActiveItemIndex(index)}
          >
            {categoryList.map((category, index) => (
              <img
                className="cursor-pointer"
                src={category.banner}
                key={index}
                onClick={() => {
                  navigate(`/product/category/${category._id}`);
                }}
              ></img>
            ))}
          </Carousel>
        </div>
      </div>

      <div className="max-w-[1200px] w-[1200px] mt-[20px] ">
        <div className="pt-4 pb-2 flex font-body text-2xl text-red font-bold items-center ml-2">
          <Bolt sx={{}} />
          <p>TODAY SPECIAL OFFERS</p>
        </div>
        <MultiCarousel responsive={responsive} itemClass="p-3">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </MultiCarousel>
      </div>

      <div className="max-w-[1200px] w-[1200px] mt-[20px]">
        <div className="pt-4 pb-2 flex font-body text-2xl text-primary font-bold items-center ml-2">
          <Bolt sx={{}} />
          <p>Top products</p>
        </div>
        <MultiCarousel responsive={responsive} itemClass="p-3">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </MultiCarousel>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Homepage;
