import customAxios from "./customApi";

class CategoryApi {
  async getAllCategories() {
    const response = await customAxios.get(`/category/`);
    return response.data;
  }

  async getCategoryById(categoryId) {
    const response = await customAxios.get(`/category/${categoryId}`);
    return response.data;
  }

  async addCategory(data) {
    const response = await customAxios.post(`admin/category/add`, data);
    return response.data;
  }

  async updateCategory(categoryId, data) {
    const response = await customAxios.post(
      `admin/category/update/${categoryId}`,
      data
    );
    return response.data;
  }

  async deleteCategory(categoryId) {
    const response = await customAxios.delete(
      `admin/category/delete/${categoryId}`
    );
    return response.data;
  }
}

export default new CategoryApi();
