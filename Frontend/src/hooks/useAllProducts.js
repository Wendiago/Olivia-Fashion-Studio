import { useQuery } from "@tanstack/react-query";
import productApi from "../api/productApi";
export const useAllProducts = (page = 1, limit = 15) => {
  const { error, data, isLoading } = useQuery({
    queryKey: ["all-products", page, limit],
    queryFn: () => productApi.getAllProduct(page, limit),
  });
  return { error, data, isLoading };
};
