import { useQuery } from "@tanstack/react-query";
import categoryApi from "../api/categoryApi";
export const useAllCategories = () => {
  const { error, data, isLoading, refetch } = useQuery({
    queryKey: ["all-category"],
    queryFn: () => categoryApi.getAllCategories(),
  });
  return { error, data, isLoading, refetch };
};
