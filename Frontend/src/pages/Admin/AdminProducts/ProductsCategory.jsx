import {
  NavLink,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { formatPrice } from "../../../utils/helpers";
import Dropdown from "react-select";
import ReactPaginate from "react-paginate";
import "./ProductsPage.css";
import {
  getAllCategory,
  fetchAsyncCategories,
} from "../../../store/CategorySlice/CategorySlice";
import {
  addAsyncProduct,
  updateAsyncProduct,
  deleteAsyncProduct,
} from "../../../store/ProductSlice/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../../components";
import ProductApi from "../../../api/productApi";
import { STATUS } from "../../../utils/status";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { Delete, Edit } from "../../../assets/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const categoryList = useSelector(getAllCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [products, setProducts] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  let [searchParams, setSearchParams] = useSearchParams();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    id_category: "",
    category: "",
    image: "",
    quantity: "",
    description: "",
  });

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const order = searchParams.get("order");

  useEffect(() => {
    dispatch(fetchAsyncCategories());
  }, []);

  //Get product list based on category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ProductApi.getAllProductOfCategory(
          categoryId,
          currentPage,
          5,
          minPrice,
          maxPrice,
          order
        );
        setTotalPages(res.totalPages);
        setTotalProducts(res.totalProducts);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentPage, categoryId, searchParams]);

  //console.log(products);
  const [priceFilterError, setPriceFilterError] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: "",
  });

  const [priceSortOption, setPriceSortOption] = useState(null);
  const options = [
    { value: "asc", label: "Price: Low to high" },
    { value: "desc", label: "Price: High to low" },
  ];
  const handlePriceSortOptionChange = (selectedOption) => {
    const existingParams = {};
    if (priceRange.min !== "" && priceRange.max !== "") {
      existingParams.minPrice = priceRange.min;
      existingParams.maxPrice = priceRange.max;
    }
    setSearchParams({ ...existingParams, order: selectedOption.value });
    setPriceSortOption(selectedOption);
  };

  const handleFilterPriceRange = () => {
    const existingParams = {};
    if (priceSortOption !== null) {
      existingParams.order = priceSortOption.value;
    }
    if (priceRange.min === "" && priceRange.max === "") {
      window.scroll(0, 0);
    } else if (Number(priceRange.min) <= Number(priceRange.max)) {
      setSearchParams({
        ...existingParams,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      });
    } else {
      setPriceFilterError("Please enter a valid price range");
    }
  };

  const handleClearAll = () => {
    // Clear all query parameters
    setSearchParams({});
    // Reset the price range state
    setPriceRange({ min: "", max: "" });
    // Clear any error messages
    setPriceFilterError("");
    //Clear any sort option
    setPriceSortOption(null);

    navigate(`/admin/products`);
  };

  const handleChangeCategory = (e, id) => {
    e.preventDefault();
    navigate(`/admin/category/${id}`);
  };

  const handleDelete = (productId) => {
    setProductIdToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    toast.success("Delete successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    dispatch(deleteAsyncProduct(productIdToDelete)).then(() => {
      const fetchData = async () => {
        try {
          const res = await ProductApi.getAllProductOfCategory(
            categoryId,
            currentPage,
            5,
            minPrice,
            maxPrice,
            order
          );
          setTotalPages(res.totalPages);
          setTotalProducts(res.totalProducts);
          setProducts(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    });
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
  };

  const handleConfirmEdit = () => {
    dispatch(
      updateAsyncProduct({
        productId: productToEdit._id,
        data: productToEdit,
      })
    ).then(() => {
      const fetchData = async () => {
        try {
          const res = await ProductApi.getAllProductOfCategory(
            categoryId,
            currentPage,
            5,
            minPrice,
            maxPrice,
            order
          );
          setTotalPages(res.totalPages);
          setTotalProducts(res.totalProducts);
          setProducts(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    });

    toast.success("Edit successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    setEditDialogOpen(false);
    setProductToEdit(null);
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setProductToEdit(null);
  };

  /**/
  const handleConfirmAdd = () => {
    if (
      newProduct.name == "" ||
      newProduct.description == "" ||
      newProduct.image == "" ||
      newProduct.id_category == "" ||
      newProduct.price <= 0 ||
      newProduct.quantity <= 0
    ) {
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
    } else {
      toast.success("Add successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      dispatch(addAsyncProduct(newProduct)).then(() => {
        const fetchData = async () => {
          try {
            const res = await ProductApi.getAllProductOfCategory(
              categoryId,
              currentPage,
              5,
              minPrice,
              maxPrice,
              order
            );
            setTotalPages(res.totalPages);
            setTotalProducts(res.totalProducts);
            setProducts(res.data);
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      });
      setAddDialogOpen(false);
      setNewProduct({
        name: "",
        price: 0,
        id_category: "",
        category: "",
        image: "",
        quantity: "",
        description: "",
      });
    }
  };

  const handleCancelAdd = () => {
    setAddDialogOpen(false);
    setNewProduct({
      name: "",
      price: 0,
      id_category: "",
      category: "",
      image: "",
      quantity: "",
      description: "",
    });
  };

  const getCategoryForProduct = (productId, categories) => {
    const matchingCategory = categories.find(
      (category) => category._id === productId
    );
    return matchingCategory.category;
  };

  const handleImageInputChange = (event, dialogType) => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (dialogType === "edit") {
          setProductToEdit((prevProduct) => ({
            ...prevProduct,
            image: reader.result,
          }));
        } else if (dialogType === "add") {
          setNewProduct((prevProduct) => ({
            ...prevProduct,
            image: reader.result,
          }));
        }
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return products ? (
    <div className="flex flex-col items-center pb-[100px]">
      <div className="max-w-[1200px] w-[1200px] grid grid-cols-[minmax(0,230px)_10fr] pt-[20px] gap-x-[28px]">
        <div className="Filter flex flex-col gap-y-[20px]">
          <div className="AllCategories flex flex-col border-t">
            <p className="pt-[12px] pb-[12px] font-body text-dark font-[600]">
              Category
            </p>
            {categoryList.map((category, index) => (
              <NavLink
                key={index}
                onClick={(e) => handleChangeCategory(e, category?._id)}
                className="pb-[9px] font-body text-grey-600"
              >
                {category?.category}
              </NavLink>
            ))}
          </div>
          <div className="PriceFilter flex flex-col border-t">
            <p className="pt-[12px] pb-[12px] font-body text-dark font-[600]">
              Price range
            </p>
            <div className="grid grid-cols-2 gap-x-1">
              <div className="flex flex-col">
                <label htmlFor="minInput" className="font-body">
                  Min
                </label>
                <input
                  className="p-[5px] border border-grey-300 rounded-md"
                  name="minInput"
                  placeholder="0"
                  onChange={(e) => {
                    setPriceFilterError("");
                    setPriceRange({ ...priceRange, min: e.target.value });
                  }}
                  value={priceRange.min}
                  onKeyDown={(e) => {
                    // Allow only numbers and specific keys like Backspace and Arrow keys
                    if (
                      !/[\d\bArrowUpArrowDownArrowLeftArrowRight]/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                ></input>
              </div>

              <div className="flex flex-col">
                <label htmlFor="maxInput" className="font-body">
                  Max
                </label>
                <input
                  className="p-[5px] border border-grey-300 rounded-md"
                  name="maxInput"
                  placeholder="999999999"
                  onChange={(e) => {
                    setPriceFilterError("");
                    setPriceRange({ ...priceRange, max: e.target.value });
                  }}
                  value={priceRange.max}
                  onKeyDown={(e) => {
                    // Allow only numbers and specific keys like Backspace and Arrow keys
                    if (
                      !/[\d\bArrowUpArrowDownArrowLeftArrowRight]/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                ></input>
              </div>
            </div>
            {priceFilterError && (
              <div className="pt-[10px] text-red font-body text-sm">
                {priceFilterError}
              </div>
            )}
          </div>
          <div
            className="h-[40px] w-full bg-white border border-grey-300 rounded-md 
              flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
            onClick={handleFilterPriceRange}
          >
            <span className="text-primary font-body font-[500] ">Apply</span>
          </div>

          <div
            className="h-[40px] w-full bg-primary border border-grey-300 rounded-md 
              flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
            onClick={handleClearAll}
          >
            <span className="text-white font-body font-[500] ">Clear All</span>
          </div>
        </div>
        <div className="View flex flex-col gap-y-3">
          <div className="sort-bar flex justify-between p-[20px] bg-white border border-grey-300 rounded-md shadow-sm">
            <div className="flex items-center justify-center">
              <p className="font-body">{totalProducts} items</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="font-body pr-2">Sort by</p>
              <Dropdown
                options={options}
                onChange={handlePriceSortOptionChange}
                placeholder="Price"
                value={priceSortOption}
                styles={{
                  control: (provided) => ({ ...provided, width: 200 }),
                  indicatorSeparator: () => ({ display: "none" }),
                }}
              />
            </div>
          </div>
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead style={{ top: 0, backgroundColor: "#fff", zIndex: 1 }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAdd()}
                      sx={{
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "none",
                        },
                        color: "white",
                      }}
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product._id.slice(-6)}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {getCategoryForProduct(product.id_category, categoryList)}
                    </TableCell>
                    <TableCell>
                      <img
                        src={product.image}
                        id={product._id}
                        width="100px"
                        height="100px"
                      />
                    </TableCell>
                    <TableCell> {formatPrice(product.price)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.description.slice(0, 60)}...</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Delete className="w-[20px] h-[20px] fill-red" />
                      </Button>

                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-[20px] h-[20px] fill-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="mt-[20px] col-span-3">
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={(event) => {
                setCurrentPage(event.selected + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              pageRangeDisplayed={5}
              pageCount={totalPages}
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

          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this product?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onClose={handleCancelEdit}>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                value={productToEdit?.name || ""}
                onChange={(e) =>
                  setProductToEdit((prevProduct) => ({
                    ...prevProduct,
                    name: e.target.value,
                  }))
                }
                fullWidth
                style={{ marginBottom: "16px", marginTop: "16px" }}
              />
              <FormControl fullWidth style={{ marginBottom: "16px" }}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={productToEdit?.id_category || ""}
                  onChange={(e) =>
                    setProductToEdit((prevProduct) => ({
                      ...prevProduct,
                      id_category: e.target.value,
                    }))
                  }
                >
                  {categoryList.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Price"
                value={productToEdit?.price || 0}
                onChange={(e) =>
                  setProductToEdit((prevProduct) => ({
                    ...prevProduct,
                    price: Number(e.target.value),
                  }))
                }
                fullWidth
                style={{ marginBottom: "16px" }}
              />
              <TextField
                label="Quantity"
                value={productToEdit?.quantity || 0}
                onChange={(e) =>
                  setProductToEdit((prevProduct) => ({
                    ...prevProduct,
                    quantity: Number(e.target.value),
                  }))
                }
                fullWidth
                style={{ marginBottom: "16px" }}
              />
              <TextField
                label="Description"
                value={productToEdit?.description || ""}
                onChange={(e) =>
                  setProductToEdit((prevProduct) => ({
                    ...prevProduct,
                    description: e.target.value,
                  }))
                }
                fullWidth
                style={{ marginBottom: "16px" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageInputChange(e, "edit")}
              />
              {productToEdit?.image && (
                <img
                  src={productToEdit.image}
                  alt="Preview"
                  width="100%"
                  height="auto"
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelEdit} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmEdit} color="secondary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Dialog */}
          <Dialog open={addDialogOpen} onClose={handleCancelAdd}>
            <DialogTitle>Add Product</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((prevProduct) => ({
                    ...prevProduct,
                    name: e.target.value,
                  }))
                }
                fullWidth
                style={{ marginBottom: "16px", marginTop: "16px" }}
              />
              <FormControl fullWidth style={{ marginBottom: "16px" }}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={newProduct.id_category}
                  onChange={(e) =>
                    setNewProduct((prevProduct) => ({
                      ...prevProduct,
                      id_category: e.target.value,
                    }))
                  }
                >
                  {categoryList.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Price"
                value={newProduct.price || 0}
                onChange={(e) =>
                  setNewProduct((prevProduct) => ({
                    ...prevProduct,
                    price: Number(e.target.value),
                  }))
                }
                fullWidth
                style={{ marginBottom: "16px" }}
              />
              <TextField
                label="Quantity"
                value={newProduct.quantity || 0}
                onChange={(e) =>
                  setNewProduct((prevProduct) => ({
                    ...prevProduct,
                    quantity: Number(e.target.value),
                  }))
                }
                fullWidth
                style={{ marginBottom: "16px" }}
              />
              <TextField
                label="Description"
                value={newProduct.description || ""}
                onChange={(e) =>
                  setNewProduct((prevProduct) => ({
                    ...prevProduct,
                    description: e.target.value,
                  }))
                }
                fullWidth
                style={{ marginBottom: "16px" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageInputChange(e, "add")}
              />
              {newProduct?.image && (
                <img
                  src={newProduct.image}
                  alt="Preview"
                  width="100%"
                  height="auto"
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelAdd} color="error">
                Cancel
              </Button>
              <Button onClick={handleConfirmAdd} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ProductsPage;
