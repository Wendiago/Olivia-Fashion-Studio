import { NavLink } from "react-router-dom";
import { formatPrice } from "../../utils/helpers";
import { Rating } from "@mui/material";
const ProductCard = ({ product }) => {
  const handlePriceRender = () => {
    if (product && product?.discountPercentage) {
      if (product.discountPercentage > 0) {
        return (
          <div className="flex gap-x-[4px]">
            <div className="newPrice font-body text-[16px] text-red">
              {formatPrice(
                product?.price -
                  product?.price * (product?.discountPercentage / 100)
              )}
            </div>
            <div className="oldPrice font-body line-through text-grey-800 text-[16px]">
              {formatPrice(product.price)}
            </div>
          </div>
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
          {formatPrice(product?.price)}
        </div>
      );
    }
  };
  return (
    <NavLink
      to={`/product/${product?._id}`}
      className="item-card grid grid-rows-[150px_1fr] h-[290px] 
                border border-grey-300 shadow-md cursor-pointer transition-transform hover:scale-105"
    >
      <div className="img-container border-b-[1px] flex justify-center">
        <img
          className="h-full object-cover relative"
          src={product?.image || ""}
        />
      </div>
      <div className="p-[8px] grid grid-rows-[1fr_16px_1fr_1fr]">
        <div className="font-body text-[12px] font-[400] text-grey-600 overflow-hidden text-ellipsis whitespace-nowrap">
          {product?.name || "No name"}
        </div>
        <div className="font-body text-[12px] font-[400] text-red self-center">
          {product?.discountPercentage && (
            <div className="">
              <span className="bg-primary text-white font-body text-[12px] font-[500] border-0 px-[4px] py-[2px]">
                {product.discountPercentage}% off
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-end">
          {handlePriceRender()}
        </div>
        <div className="flex justify-between items-end">
          <Rating
            readOnly
            precision={0.5}
            value={product?.rating ?? 0}
            sx={{ fontSize: "16px" }}
          />
          <div className="font-body text-[12px] text-grey-500">
            {product?.quantity ?? 0} stock
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ProductCard;
