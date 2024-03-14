import React, { useState, useEffect } from "react";
import TransactionApi from "../../../api/transactionApi";
import TransactionItem from "./TransactionItem";
import ReactPaginate from "react-paginate";
import { 
    getAllUsers,
    fetchAsyncUsers
} from "../../../store/UsersSlice/UsersSlice";
import { useDispatch, useSelector } from "react-redux";

const AdminTransaction = () => {
    const dispatch = useDispatch();
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const transactionsPerPage = 5;
    const users = useSelector(getAllUsers);

    useEffect(() => {
        dispatch(fetchAsyncUsers());
    }, []);

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            console.log(currentPage)
            const response = await TransactionApi.getAllTransactionForAdmin(currentPage, 4);
            console.log(response);
            if (response.status === 200) {
                console.log(response);
                setTransactions(response.data.data);
                setPageCount(response.data.totalPages);
        }
        };
        fetchTransactionHistory();
    }, [currentPage]);

    return (
        <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px]">
        <div className="max-h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
        <div className="flex flex-col justify-center items-center mx-auto">
            {transactions.length === 0 ? (
                <p className="font-body py-5">There is no transaction.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                {transactions.map((transaction, index) => (
                    <TransactionItem key={index} transaction={transaction} users={users} />
                ))}
                </div>
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
        </div>
    );
};

export default AdminTransaction;
