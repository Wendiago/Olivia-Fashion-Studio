import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import "react-multi-carousel/lib/styles.css";
import { Loading } from "../../../components";
import { Delete, Edit } from "../../../assets/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAllCategories } from "../../../hooks/useAllCategories";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import categoryApi from "../../../api/categoryApi";

const AdminCategories = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [newCategory, setNewCategory] = useState({
    category: "",
    banner: "",
  });

  // Fetch categories
  const {
    data: categoryList = {},
    isLoading,
    error,
    refetch,
  } = useAllCategories();
  const { data: categories = [] } = categoryList;

  // Add category mutation
  const addMutation = useMutation({
    mutationFn: (newCategory) => categoryApi.addCategory(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-category"]); // Refetch categories
      toast.success("Add successfully", { autoClose: 2000, theme: "colored" });
      setAddDialogOpen(false);
      setNewCategory({ category: "", banner: "" });
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (categoryIdToDelete) =>
      categoryApi.deleteCategory(categoryIdToDelete),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-category"]); // Refetch categories
      toast.success("Delete successfully", {
        autoClose: 2000,
        theme: "colored",
      });
      setDeleteDialogOpen(false);
      setCategoryIdToDelete(null);
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["all-category"]); // Refetch categories
      toast.success("Edit successfully", { autoClose: 2000, theme: "colored" });
      setEditDialogOpen(false);
      setCategoryToEdit(null);
    },
  });

  const handleChangeCategory = (e, id) => {
    e.preventDefault();
    navigate(`/admin/category/${id}`);
  };

  const handleDelete = (categoryId) => {
    setCategoryIdToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (category) => {
    console.log(category);
    setCategoryToEdit(category);
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setAddDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(categoryIdToDelete);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryIdToDelete(null);
  };

  const handleConfirmEdit = () => {
    if (!categoryToEdit || !categoryToEdit._id) return;
    console.log("Cat to edit: ", categoryToEdit);
    updateMutation.mutate({ id: categoryToEdit._id, data: categoryToEdit });
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setCategoryToEdit(null);
  };

  const handleConfirmAdd = () => {
    if (newCategory.category === "" || newCategory.banner === "") {
      toast.error("You cannot leave the input blank", {
        autoClose: 2000,
        theme: "colored",
      });
    } else {
      addMutation.mutate(newCategory);
    }
  };

  const handleCancelAdd = () => {
    setAddDialogOpen(false);
    setNewCategory({ category: "", banner: "" });
  };

  const handleBannerInputChange = (event, dialogType) => {
    const bannerFile = event.target.files[0];

    if (bannerFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (dialogType === "edit") {
          setCategoryToEdit((prevCategory) => ({
            ...prevCategory,
            banner: reader.result,
          }));
        } else if (dialogType === "add") {
          setNewCategory((prevCategory) => ({
            ...prevCategory,
            banner: reader.result,
          }));
        }
      };
      reader.readAsDataURL(bannerFile);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

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
                <TableCell>Category</TableCell>
                <TableCell>Banner</TableCell>
                <TableCell sx={{ display: "flex", justifyContent: "center" }}>
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
              {categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell>{category._id.slice(-6)}</TableCell>
                  <TableCell>
                    <NavLink
                      key={index}
                      onClick={(e) => handleChangeCategory(e, category?._id)}
                      className="pb-[9px] font-body text-grey-600"
                    >
                      {category?.category}
                    </NavLink>
                  </TableCell>
                  <TableCell>
                    <img
                      className="cursor-pointer"
                      src={category.banner}
                      alt={category.category}
                      width={"200px"}
                      height={"150px"}
                      onClick={(e) => handleChangeCategory(e, category?._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center justify-center">
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Delete className="w-[20px] h-[20px] fill-red" />
                      </Button>

                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-[20px] h-[20px] fill-primary" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this category?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={handleCancelEdit}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={categoryToEdit?.category || ""}
              onChange={(e) =>
                setCategoryToEdit((prevCategory) => ({
                  ...prevCategory,
                  category: e.target.value,
                }))
              }
              fullWidth
              style={{ marginBottom: "16px", marginTop: "16px" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleBannerInputChange(e, "edit")}
            />
            {categoryToEdit?.banner && (
              <img
                src={categoryToEdit.banner}
                alt="Preview"
                width="100%"
                height="auto"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelEdit} color="error">
              Cancel
            </Button>
            <Button onClick={handleConfirmEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onClose={handleCancelAdd}>
          <DialogTitle>Add Category</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={newCategory.category}
              onChange={(e) =>
                setNewCategory((prevCategory) => ({
                  ...prevCategory,
                  category: e.target.value,
                }))
              }
              fullWidth
              style={{ marginBottom: "16px", marginTop: "16px" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleBannerInputChange(e, "add")}
            />
            {newCategory.banner && (
              <img
                src={newCategory.banner}
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
  );
};

export default AdminCategories;
