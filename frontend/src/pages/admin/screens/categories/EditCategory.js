import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  getSingleCategory,
  updateCategory,
} from "../../../../services/index/postCategories";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const EditCategory = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [categoryTitle, setCategoryTitle] = useState("");
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);

  const { isLoading, isError } = useQuery({
    queryFn: () =>
      getSingleCategory({ slug, successFlag: true, setCategoryTitle }),
    queryKey: ["categories", slug],
  });

  const { mutate: mutateUpdateCategory, isLoading: isLoadingUpdateCategory } =
    useMutation({
      mutationFn: ({ title, slug, token }) => {
        return updateCategory({ title, slug, token });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["categories", slug]);
        toast.success("Category is updated successfully");
        navigate(`/admin/categories/manage`, {
          replace: true,
        });
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const handleUpdateCategory = () => {
    if (!categoryTitle) return;
    mutateUpdateCategory({
      title: categoryTitle,
      slug,
      token: userState.userInfo.token,
    });
  };

  return (
    <div className="d-form-control w-full">
      <h4 className="text-lg leading-tight">Update Category</h4>
      <input
        value={categoryTitle}
        type="text"
        onChange={(e) => setCategoryTitle(e.target.value)}
        className="px-4 py-2 w-full border-2 mt-4 border-slate-300 outline-slate-500 text-[22px] font-roboto font-medium text-dark-hard rounded-md"
        placeholder="Edit category here..."
      />
      <button
        disabled={isLoadingUpdateCategory || isLoading || isError}
        type="button"
        onClick={handleUpdateCategory}
        className="w-fit bg-green-500 rounded-lg px-4 text-white font-semibold py-2 mt-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Update
      </button>
    </div>
  );
};
export default EditCategory;
