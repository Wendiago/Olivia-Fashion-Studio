import { useState, useEffect } from "react";
import TransactionApi from "../../api/transactionApi";
import { formatPrice } from "../../utils/helpers";
import { toast } from "react-toastify";
const Topup = () => {
  const [accountBalance, setAccountBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [error, setError] = useState("");

  const fetchAccountBalance = async () => {
    const response = await TransactionApi.getAccountBalance();
    if (response.status === 200) {
      //console.log(response);
      setAccountBalance(response.data.data);
    }
  };

  useEffect(() => {
    fetchAccountBalance();
  }, []);

  const topUp = async () => {
    const response = await TransactionApi.topUp({
      amount: Number(topUpAmount),
    });
    //console.log(response);
    if (response.status === 200) {
      fetchAccountBalance();
      setTopUpAmount("");
      toast.success("Top up successfully");
    } else {
      toast.error("Fail to top up. Please try again");
    }
  };

  const handleAmountInput = (e) => {
    if (isNaN(e.target.value)) {
      setError("Invalid top up amount!");
    } else if (e.target.value <= 0) {
      setError("Invalid top up amount!");
    } else {
      setError("");
    }
    setTopUpAmount(e.target.value);
  };

  const handleTopUp = async () => {
    if (!error) {
      await topUp();
    }
  };
  return (
    <div>
      <header className="heading flex flex-col border-b pt-[20px] pb-[15px]">
        <span className="font-body text-[18px] text-dark font-[500]">
          Top up
        </span>
      </header>
      <main className="py-5 flex flex-col justify-center gap-y-5 ">
        <div>
          <span className="font-[500] font-body">Account balance: </span>
          <span className="font-body text-red text-[18px]">
            {formatPrice(accountBalance)}
          </span>
        </div>
        <div className="flex items-center gap-x-4">
          <label htmlFor="amount" className="font-[500] font-body">
            Enter a top up amount:{" "}
          </label>
          <input
            className="px-[10px] py-[5px] border-2 rounded-md border-grey-500"
            name="amount"
            onChange={handleAmountInput}
            value={topUpAmount}
          ></input>
          <div className="error-message font-body text-red">{error}</div>
        </div>
        <div>
          <button
            className="px-[10px] py-[5px] text-white bg-primary font-body rounded-md"
            onClick={handleTopUp}
          >
            Top Up
          </button>
        </div>
      </main>
    </div>
  );
};

export default Topup;
