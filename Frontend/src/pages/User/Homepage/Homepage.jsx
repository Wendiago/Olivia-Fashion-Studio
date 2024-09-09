import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import MultiCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Bolt } from "@mui/icons-material";
import { ProductCard, Loading } from "../../../components";
import { useAllCategories } from "../../../hooks/useAllCategories";
import { useAllProducts } from "../../../hooks/useAllProducts";
import { placeholder } from "../../../assets/imgs";

const Homepage = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const navigate = useNavigate();

  const {
    data: categoryList = {},
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useAllCategories();
  const {
    data: productList = {},
    isLoading: isProductsLoading,
    error: productsError,
  } = useAllProducts(1, 15);

  const { data: categories = [] } = categoryList;
  const { data: products = [] } = productList;

  const handleCategoryButtonClick = (category) => {
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

  return (
    <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px]">
      <div className="h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
        <ul className="categoryBar p-[14px]">
          {categories.map((category, index) => (
            <li
              key={index}
              className="pt-3 pb-3 pl-3 pr-20 font-body text-grey-600 cursor-pointer
              hover:bg-secondary hover:text-dark hover:border-0 hover:rounded-md "
              onClick={() => handleCategoryButtonClick(category)}
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
            className="w-full h-full"
          >
            {isCategoriesLoading ? (
              <img className="cursor-pointer " src={placeholder}></img>
            ) : (
              categories.map((category, index) => (
                <img
                  className="cursor-pointer"
                  loading="lazy"
                  src={category.banner}
                  key={index}
                  onClick={() => {
                    navigate(`/product/category/${category._id}`);
                  }}
                ></img>
              ))
            )}
            {}
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
  );
};

export default Homepage;
