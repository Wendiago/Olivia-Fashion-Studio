import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Rating } from "@mui/material";
import { Star } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Review, Sold, Cart } from "../../../assets/icons";
import { formatPrice } from "../../../utils/helpers";
import { ProductCard, NumberInput, Loading } from "../../../components";
import ProductApi from "../../../api/productApi";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../../store/CartSlice/CartSlice";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#FF9017",
  },
});

const ProductDetail = () => {
  const { user } = useAuth();
  //console.log(user);
  const dispatch = useDispatch();
  //Get product id
  const { id } = useParams();
  const [zoomImage, setZoomImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ProductApi.getSingleProduct(id);
        const res2 = await ProductApi.getRelatedProducts(id);
        setProduct(res.data);
        setRelatedProducts(res2.data);
        setZoomImage(res.data.image);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (product && product.image) {
      setZoomImage(product.image);
    }
  }, [zoomImage]);

  const handlePriceRender = () => {
    if (product && product?.discountPercentage) {
      if (product.discountPercentage > 0) {
        return (
          <>
            <div className="oldPrice font-body line-through text-grey-800 text-[18px]">
              {formatPrice(product.price)}
            </div>
            <div className="newPrice font-body text-[30px] text-red">
              {formatPrice(
                product?.price -
                  product?.price * (product?.discountPercentage / 100)
              )}
            </div>
            <div className="discount-percentage h-0.5 flex items-center">
              <span className="text-white font-body font-[600] bg-red p-1">
                {product?.discountPercentage}% OFF
              </span>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="newPrice font-body text-[30px] text-red">
              {formatPrice(product?.price)}
            </div>
          </>
        );
      }
    } else {
      return (
        <div className="newPrice font-body text-[30px] text-red font-[500]">
          {formatPrice(product?.price)}
        </div>
      );
    }
  };

  const handleQuantityInput = (newValue) => {
    setQuantity(newValue);
  };

  //console.log(quantity);

  const handleAddToCart = () => {
    if (user.isAuthenticated) {
      if (product?.quantity > 0) {
        console.log(quantity);
        dispatch(addToCart({ productId: product._id, quantity: quantity }));
      }
    } else {
      toast.warning("You have to log in first");
    }
  };

  const handleBuyNow = () => {
    if (product?.quantity > 0) {
    }
  };
  return (
    product &&
    relatedProducts && (
      <div className="flex flex-col items-center pb-[100px]">
        <div className="max-w-[1200px] w-[1200px] flex flex-col justify-center items-center">
          <div
            className="product-section mt-[20px] w-full grid gap-x-[18px] grid-cols-12 p-[20px] min-h-[580px] bg-white
        border border-grey-300 rounded-[6px]
        "
          >
            <div className="h-[380px] image-section col-span-5">
              <div className="border rounded-[6px] h-full p-1 flex justify-center">
                <img className="zoom-item object-fit h-full" src={zoomImage} />
              </div>

              <div className="other-imgs mt-[20px] grid grid-cols-5 gap-x-[9px]">
                <img
                  className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                  src={product?.image || ""}
                  onClick={() => setZoomImage(product?.image || "")}
                />
                <img
                  className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                  src={product?.image || ""}
                  onClick={() => setZoomImage(product?.image || "")}
                />
                <img
                  className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                  src={product?.image || ""}
                  onClick={() => setZoomImage(product?.image || "")}
                />
                <img
                  className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                  src={product?.image || ""}
                  onClick={() => setZoomImage(product?.image || "")}
                />
                <img
                  className="thumb-item p-[1px] object-fit h-full rounded-[6px] aspect-square 
                transition-transform hover:scale-125 cursor-pointer"
                  src={product?.image || ""}
                  onClick={() => setZoomImage(product?.image || "")}
                />
              </div>
            </div>
            <div className="info-section col-span-7">
              <div className="product-name pb-2 pt-2 font-body text-2xl font-[600]">
                {product.name ?? "unknown"}
              </div>
              <div className="rating-review-sold pb-[14px] flex gap-x-[28px]">
                <div className="rating flex">
                  <StyledRating
                    readOnly
                    precision={0.5}
                    value={product.rating ?? 0}
                    icon={<Star />}
                  />
                  <p className="font-body text-orange">
                    {product.rating ?? 0.0}
                  </p>
                </div>
                <div className="reviews flex items-center gap-x-2">
                  <Review className="fill-grey-500" />
                  <p className="font-body text-grey-500">
                    {product.reviews ?? 0} reviews
                  </p>
                </div>
                <div className="sold flex items-center gap-x-2">
                  <Sold className="fill-grey-500" />
                  <p className="font-body text-grey-500">
                    {product.sold ?? 0} sold
                  </p>
                </div>
              </div>
              <div className="price-section bg-grey-100 px-[20px] py-[15px] flex items-center gap-x-[10px]">
                {handlePriceRender()}
              </div>
              <div className="additional-info p-[20px] flex flex-col gap-y-[16px] border-b-2">
                <div className="description grid grid-cols-[3fr_9fr]">
                  <div className="font-body text-grey-500">Description: </div>
                  <div className="font-body">
                    {product?.description ?? "No description"}
                  </div>
                </div>
                <div className="category grid grid-cols-[3fr_9fr]">
                  <div className="font-body text-grey-500">Category: </div>
                  <div>{product?.category ?? "No category"}</div>
                </div>
                <div className="warranty grid grid-cols-[3fr_9fr]">
                  <div className="font-body text-grey-500">Brand: </div>
                  <div>{product?.brand ?? "Unknown"}</div>
                </div>
                <div className="warranty grid grid-cols-[3fr_9fr]">
                  <div className="font-body text-grey-500">Warranty: </div>
                  <div>{product?.warranty ?? "2 years full warranty"}</div>
                </div>
              </div>
              <div className="quantity-selection px-[20px] pt-[20px] grid grid-cols-[3fr_9fr]">
                <div className="font-body text-grey-500">Quantity: </div>
                <div className="quantity-input flex items-center gap-x-[20px]">
                  <NumberInput
                    initialValue={1}
                    key={product._id}
                    onChange={handleQuantityInput}
                    maxValue={product?.quantity ?? undefined}
                  />
                  <div className="stock font-body text-grey-500">
                    {product?.quantity} pieces available
                  </div>
                </div>
              </div>
              <div className="purchase-section mx-[20px] mt-[20px] flex items-center gap-x-5">
                <div
                  className="add-to-cart-button flex items-center gap-x-2 py-[15px] px-[20px] w-[163px]
              border border-grey-300 shadow-sm rounded-[6px] transition-transion hover:scale-105 cursor-pointer hover:bg-grey-100"
                  onClick={handleAddToCart}
                >
                  <Cart className="fill-primary" />
                  <span className="text-primary font-body font-[500]">
                    Add To Cart
                  </span>
                </div>

                <div
                  className="buy-now-button flex items-center justify-center gap-x-2 py-[15px] px-[20px] bg-primary w-[163px]
              border border-primary shadow-sm rounded-[6px] transition-transion hover:scale-105 cursor-pointer hover:opacity-90"
                  onClick={handleBuyNow}
                >
                  <span className="text-white font-body font-[500]">
                    Buy Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="related-items-section mt-[20px] w-full flex flex-col">
            <div className="font-body font-[600] text-[20px] pt-[20px] pb-[10px]">
              Related products
            </div>
            <div className="product grid grid-cols-6 gap-3">
              {relatedProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductDetail;
