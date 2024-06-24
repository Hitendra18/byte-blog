import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../../../../services/index/postCategories";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Categories = () => {
  const [categoryTitle, setCategoryTitle] = useState("");

  const { mutate: mutateCreateCategory, isLoading: isLoadingCreateCategory } =
    useMutation({
      mutationFn: ({ token, title }) => {
        return createCategory({ token, title });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["categories"]);
        toast.success("New category is created successfully!");
        setCategoryTitle("");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const handleCreateCategory = () => {
    mutateCreateCategory({
      token: userState.userInfo.token,
      title: categoryTitle,
    });
  };

  const {
    userState,
    currentPage,
    setCurrentPage,
    searchKeyWord,
    data: categoriesData,
    isLoading,
    isFetching,
    isLoadingDeleteData: isLoadingDeletePost,
    queryClient,
    deleteDataHandler: deletePostHandler,
    searchKeyWordHandler,
    submitSearchKeyWordHandler,
  } = useDataTable({
    dataQueryFn: () => getAllCategories(searchKeyWord, currentPage),
    dataQueryKey: "categories",
    mutateDeleteFn: ({ slug, token }) => deleteCategory({ slug, token }),
    deleteDataMessage: "Category deleted successfully",
  });

  return (
    <div className="md:grid md:grid-cols-12 md:gap-x-4">
      <div className="col-span-4 py-8">
        <h4 className="text-lg leading-tight mt-4">Add new Category</h4>
        <div className="d-form-control w-full mt-2">
          <input
            value={categoryTitle}
            type="text"
            onChange={(e) => setCategoryTitle(e.target.value)}
            className="px-4 py-2 w-full border-2 mt-4 border-slate-300 outline-slate-500 text-[22px] font-roboto font-medium text-dark-hard rounded-md"
            placeholder="Enter category here..."
          />
          <button
            disabled={isLoadingCreateCategory}
            type="button"
            onClick={handleCreateCategory}
            className="w-fit bg-green-500 rounded-lg px-4 text-white font-semibold py-2 mt-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Create
          </button>
        </div>
      </div>
      <div className="col-span-8">
        <DataTable
          dataListName="Categories"
          searchInputPlaceHolder="Search category here..."
          searchKeyWordOnSubmitHandler={submitSearchKeyWordHandler}
          searchKeyWordOnChangeHandler={searchKeyWordHandler}
          searchKeyWord={searchKeyWord}
          tableHeaderTitleList={["Title", "Created At", "Actions"]}
          isLoading={isLoading}
          isFetching={isFetching}
          data={categoriesData?.data}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          headers={categoriesData?.headers}
          userState={userState}
        >
          {categoriesData?.data.map((category) => (
            <tr>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {category?.title}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p className="text-gray-900 whitespace-no-wrap">
                  {new Date(category.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </td>

              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
                <button
                  disabled={isLoadingDeletePost}
                  onClick={() => {
                    deletePostHandler({
                      slug: category?._id,
                      token: userState.userInfo.token,
                    });
                  }}
                  type="button"
                  className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
                <Link
                  to={`/admin/categories/manage/edit/${category?._id}`}
                  className="text-green-600 hover:text-green-900"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
};
export default Categories;
