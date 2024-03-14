import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import TransactionApi from "../../api/transactionApi";
import TransactionItem from "../TransactionItem/TransactionItem";
import ReactPaginate from "react-paginate";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      const response = await TransactionApi.getAllTransaction();
      if (response.status === 200) {
        console.log(response);
        setTransactions(response.data.data);
      }
    };
    fetchTransactionHistory();
  }, []);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const pageCount = Math.ceil(transactions.length / transactionsPerPage);

  return (
    user && (
      <div className="flex flex-col justify-center">
        <header className="heading flex flex-col border-b pt-[20px] pb-[15px]">
          <span className="font-body text-[18px] text-dark font-[500]">
            My transactions
          </span>
        </header>
        <div className="flex flex-col justify-center items-center">
          {transactions.length === 0 ? (
            <p className="font-body py-5">You have no transaction.</p>
          ) : (
            currentTransactions.map((transaction, index) => (
              <TransactionItem key={index} transaction={transaction} />
            ))
          )}
          {transactions.length !== 0 && (
            <div className="flex items-center justify-center py-5">
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={(event) => {
                  setCurrentPage(event.selected + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                pageRangeDisplayed={5}
                pageCount={pageCount}
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
          )}
        </div>
      </div>
    )
  );
};

export default TransactionHistory;
