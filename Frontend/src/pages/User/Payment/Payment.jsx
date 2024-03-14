import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatPrice } from "../../../utils/helpers";
import {
  fetchCart,
  deleteCart,
  itemsCount,
  carts,
  totalPrice,
  totalQuantity,
} from "../../../store/CartSlice/CartSlice";
import orderApi from "../../../api/orderApi";
import paymentApi from "../../../api/paymentApi";
import { useSelector, useDispatch } from "react-redux";
import customAxios from "../../../api/customApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentCart = useSelector(carts);
  const total_price = useSelector(totalPrice);
  const total_quantity = useSelector(totalQuantity);
  const items_count = useSelector(itemsCount);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [openPin, setOpenPin] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  const handleCheckout = async () => {
    if (name !== "" || address !== "" || phone !== "") {
      const res = await paymentApi.sendPin();

      if (res.data.success === true) {
        toast.success("Send PIN successfully, please check out your email", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setOpenPin(true);
      } else {
        toast.error("Error sending PIN", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error("You cannot leave the input blank", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handlePinChange = (event) => {
    // Ensure only numeric input and limit to 6 digits
    const newPin = event.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6);
    setPin(newPin);
  };

  const handleCancel = () => {
    setPin("");
    setOpenPin(false);
  };

  function transformArray(inputArray) {
    return inputArray.map((item) => {
      const { productId, ...rest } = item;
      return { product: productId, ...rest };
    });
  }

  const handleConfirm = async () => {
    const sendCode = await paymentApi.sendCode(pin);

    if (sendCode.data.success === true) {
      const sendPayment = await paymentApi.sendPaymentData(total_price);

      if (sendPayment.data.success === true) {
        const createOrder = await orderApi.createOrder(
          name,
          address,
          phone,
          transformArray(currentCart),
          total_price
        );

        if (createOrder.data.success === true) {
          dispatch(deleteCart());
          navigate(`/`);
          toast.success("Payment successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
          navigate(`/cart`);
          toast.error("Error creating order", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      } else {
        toast.error("Insufficient balance in the account, please top up", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error("Error verify", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  return items_count !== 0 ? (
    <div className="flex flex-col items-center pb-[100px]">
      <div className="max-w-[1200px] w-[1200px] flex flex-col justify-center items-center">
        <div className="my-[28px] w-full flex justify-start">
          <span className="font-body text-[24px] font-[600]">{`My Cart (${items_count})`}</span>
        </div>
        <div className="cart-section flex flex-col w-full gap-y-6">
          <div className="grid grid-cols-2 gap-10">
            <div className="cart-item-section max-h-[300px] overflow-y-auto bg-white border rounded-md border-grey-300 flex flex-col divide-y">
              {currentCart.map((cartItem) => (
                <div
                  key={cartItem?.productId?._id}
                  className="p-[18px] grid grid-cols-[70px_1.5fr_1fr_1fr_1fr_1fr] gap-x-[4px]"
                >
                  <div className="image col-span-1">
                    <img
                      src={cartItem?.productId?.image || ""}
                      className="w-full object-cover h-[70px]"
                    ></img>
                  </div>
                  <div className="pl-[10px] item-name col-span-1 font-body font-[500] flex items-center justify-center">
                    {cartItem?.productId?.name || "unknown"}
                  </div>
                  <div className="pl-[10px] item-name col-span-1 flex items-center justify-center">
                    <span className="font-body font-[500]">
                      {formatPrice(cartItem?.productId?.price)}
                    </span>
                  </div>
                  <div className="quantity-input flex items-center justify-center">
                    {cartItem?.quantity}
                  </div>
                  <div className="quantity-input flex items-center justify-center text-red font-[500]">
                    {formatPrice(
                      cartItem?.quantity * cartItem?.productId?.price
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="cart-item-section bg-white border rounded-md border-grey-300 flex flex-col divide-y"
              style={{ padding: "16px" }}
            >
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                style={{ marginBottom: "20px", marginTop: '30px' }}
              />

              <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                style={{ marginBottom: "20px" }}
              />

              <TextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                style={{ marginBottom: "16px" }}
              />
            </div>
          </div>

          <Dialog open={openPin} onClose={handleCancel}>
            <DialogTitle>Enter 6-character PIN</DialogTitle>
            <DialogContent>
              <TextField
                label="PIN"
                value={pin}
                onChange={handlePinChange}
                fullWidth
                style={{ marginBottom: "16px", marginTop: "16px" }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                color="primary"
                disabled={pin.length !== 6}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          <div
            className="checkout sticky bottom-0 bg-white shadow-sm flex justify-between items-center
           min-h-[100px] border border-grey-300 rounded-md p-6"
          >
            <div className="flex items-center gap-x-4">
              <div className="font-body">
                <span className="font-[600] text-dark">Total items: {""}</span>
                {total_quantity}
              </div>
            </div>
            <div className="flex items-center gap-x-8">
              <div className="">
                Total:{"  "}
                <span className="text-red text-[24px] font-[500]">
                  {formatPrice(total_price)}
                </span>
              </div>
              <div
                className="font-body text-[20px] px-[30px] py-[5px] bg-primary text-white
              border rounded-md cursor-pointer hover:opacity-90 shadow-sm"
                onClick={handleCheckout}
              >
                Confirm Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center pb-[100px]">
      <div className="max-w-[1200px] w-[1200px] flex flex-col justify-center items-center">
        <NavLink
          to={`/`}
          className="font-body text-[32px] flex justify-center items-center pt-[40px]"
        >
          Your cart is empty. Let's go shopping now
        </NavLink>
      </div>
    </div>
  );
};

export default Cart;
