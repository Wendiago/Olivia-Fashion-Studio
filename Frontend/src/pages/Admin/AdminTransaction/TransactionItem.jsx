import { formatPrice, formatDateAndTime } from "../../../utils/helpers";

const TransactionItem = ({ transaction, users }) => {
  const findUserById = (userId) => {
    console.log(users)
    return users.find(user => user._id === userId);
  };
  console.log(transaction)

  return (
    <div className="w-full flex flex-col my-5 divide-y-0 border border-grey-300 rounded-md">
      <div
        className={`flex justify-between items-center p-3 border-0 rounded-t-md ${
          transaction?.status === "PENDING"
            ? "bg-secondary"
            : transaction?.status === "COMPLETED"
            ? "bg-baseGreen"
            : transaction?.status === "FAILED"
            ? "bg-baseRed"
            : "text-dark"
        }`}
      >
        <div className="font-body">
          <span className="font-[600]">Transaction ID:</span>{" "}
          {transaction?._id || "#NoId"}
        </div>
        <div
          className={`font-[600] font-body ${
            transaction?.status === "PENDING"
              ? "text-primary"
              : transaction?.status === "COMPLETED"
              ? "text-green"
              : transaction?.status === "FAILED"
              ? "text-red"
              : "text-dark"
          }`}
        >
          {transaction?.status || "NO STATUS"}
        </div>
      </div>
      <div className="flex flex-col justify-center p-3">
        <div>
          <span className="font-[500]">Username: </span>
          {findUserById(transaction?.accountId.userId).username || "#NoUsername"}
        </div>
        <div>
          <span className="font-[500]">Date and time: </span>
          {formatDateAndTime(transaction?.createdAt)}
        </div>
        <div>
          <span className="font-[500]">Type: </span>
          <span className="text-dark">{transaction?.type}</span>
        </div>
        <div>
          <span className="font-[500]">Amount: </span>
          {formatPrice(transaction?.amount || 0)}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
