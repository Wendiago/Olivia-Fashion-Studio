import { formatPrice } from "../../utils/helpers";
const OrderItem = ({ order }) => {
  const items = order.items;
  return (
    <div className="w-full flex flex-col gap-y-2 px-[10px] py-[20px] my-5 border border-grey-300 rounded-md">
      <div className="flex justify-between items-center">
        <div className="font-body text-[18px] font-[500]">
          Order ID: {order?._id || "#NoId"}
        </div>
        <div
          className={`font-[600] font-body ${
            order?.status === "PENDING"
              ? "text-primary"
              : order?.status === "PROCESSING"
              ? "text-primary"
              : order?.status === "SHIPPING"
              ? "text-orange"
              : order?.status === "COMPLETED"
              ? "text-green"
              : order?.status === "CANCELLED"
              ? "text-red"
              : "text-dark"
          }`}
        >
          {order?.status || "NO STATUS"}
        </div>
      </div>

      {items.map((item, index) => (
        <div key={index} className="item flex justify-between p-1 bg-white">
          <div className="flex items-center justify-center gap-x-3">
            <img
              src={item?.product?.image || ""}
              className="w-[50px] h-[50px]"
              alt={item?.product?.name || "unknown"}
            ></img>
            <div className="font-body">{item?.name}</div>
            <div className="font-body text-dark">x{item?.quantity}</div>
          </div>
          <div className="font-body flex items-center justify-center ">
            {formatPrice(item?.product?.price)}
          </div>
        </div>
      ))}

      <div className="font-body flex items-center justify-end pt-3 px-3 gap-x-2 border-t">
        Total price:{" "}
        <span className="text-red ">{formatPrice(order.totalPrice || 0)}</span>
      </div>
    </div>
  );
};

export default OrderItem;
