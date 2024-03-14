import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProduct,
  fetchAsyncAllProduct,
} from "../../../store/ProductSlice/ProductSlice";
import {
  getAllOrder,
  getAllOrderStatus,
  fetchAsyncOrders,
  updateAsyncOrder,
} from "../../../store/OrderSlice/OrderSlide";
import { STATUS } from "../../../utils/status";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Loading } from "../../../components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDateAndTime } from "../../../utils/helpers";
import theme from "../../../utils/MuiTheme";
import { formatPrice } from "../../../utils/helpers";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getAllOrder);
  const orderStatus = useSelector(getAllOrderStatus);

  const productList = useSelector(getAllProduct);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailsDialogOpen, setOrderDetailsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAsyncAllProduct());
    dispatch(fetchAsyncOrders());
  }, []);

  if (orderStatus === STATUS.LOADING) {
    return <Loading />;
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsDialogOpen(true);
  };

  const handleChangeStatus = (orderId, newStatus) => {
    setSelectedOrder((prevOrder) => ({
      ...prevOrder,
      status: newStatus,
    }));

    dispatch(
      updateAsyncOrder({
        orderId: orderId,
        data: {
          status: newStatus,
        },
      })
    ).then(() => dispatch(fetchAsyncOrders()));

    toast.success("Change status successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleCancelDetails = () => {
    setOrderDetailsDialogOpen(false);
    setSelectedOrder(null);
  };

  const getProductById = (productId, products) => {
    const product = products.find((product) => product._id === productId);
    return product ? product : { name: "Product not found" };
  };

  return (
    <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px]">
      <div className="max-h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            >
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  sx={{ bgcolor: theme.palette.orderStatus[order.status] }}
                >
                  <TableCell>{order._id.slice(-6)}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{formatDateAndTime(order.createdAt)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewDetails(order)}
                      sx={{
                        "&:hover": {
                          boxShadow: "none",
                        },
                        boxShadow: "none",
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Order Details Dialog */}
        <Dialog
          open={orderDetailsDialogOpen}
          onClose={handleCancelDetails}
          maxWidth="md"
        >
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <>
                <div>
                  <strong>Order ID:</strong> {selectedOrder._id.slice(-6)}
                </div>
                <div>
                  <strong>Total Price:</strong>
                  {formatPrice(selectedOrder.totalPrice)}
                </div>
                {/* Products Table */}
                <Table
                  style={{
                    width: "400px",
                    marginTop: "16px",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {
                            getProductById(product.product._id, productList)
                              .name
                          }
                        </TableCell>
                        <TableCell>
                          <img
                            src={
                              getProductById(product.product._id, productList)
                                .image
                            }
                            alt={product._id}
                            width={"80px"}
                            height={"60px"}
                          />
                        </TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
            <FormControl fullWidth style={{ marginTop: "16px" }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={selectedOrder?.status || ""}
                onChange={(e) =>
                  handleChangeStatus(selectedOrder?._id, e.target.value)
                }
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="PROCESSING">Processing</MenuItem>
                <MenuItem value="SHIPPING">Shipping</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDetails} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminOrders;
