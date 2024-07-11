import { images } from "../../../../constants";
import { deletePost, getAllPosts } from "../../../../services/index/posts";
import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import DataTable from "../../components/DataTable";

const ManagePosts = () => {
  const {
    userState,
    currentPage,
    setCurrentPage,
    searchKeyWord,
    data: postsData,
    isLoading,
    isFetching,
    isLoadingDeleteData: isLoadingDeletePost,
    // queryClient,
    deleteDataHandler: deletePostHandler,
    searchKeyWordHandler,
    submitSearchKeyWordHandler,
  } = useDataTable({
    dataQueryFn: () => getAllPosts(searchKeyWord, currentPage),
    dataQueryKey: "posts",
    mutateDeleteFn: ({ slug, token }) => deletePost({ slug, token }),
    deleteDataMessage: "Post deleted successfully",
  });

  return (
    <DataTable
      dataListName="Manage Posts"
      searchInputPlaceHolder="Search post here..."
      searchKeyWordOnSubmitHandler={submitSearchKeyWordHandler}
      searchKeyWordOnChangeHandler={searchKeyWordHandler}
      searchKeyWord={searchKeyWord}
      tableHeaderTitleList={[
        "Title",
        "Category",
        "Created At",
        "Tags",
        "Actions",
      ]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={postsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={postsData?.headers}
      // userState={userState}
    >
      {postsData?.data.map((post) => (
        <tr key={post?.slug}>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to={`/blog/${post?.slug}`} className="relative block">
                  <img
                    alt="post title"
                    src={
                      post?.photo
                        ? post?.photo
                        : images.SampleImage
                    }
                    className="mx-auto object-cover rounded-md aspect-square w-10 "
                  />
                </Link>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">
                  {post?.title}
                </p>
              </div>
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {post.categories.length > 0
                ? post.categories
                    .slice(0, 3)
                    .map(
                      (category, index) =>
                        `${category.title}${post.categories.slice(0, 3).length === index + 1 ? "" : ", "}`
                    )
                : "Uncategorized"}
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex gap-x-2">
              {post.tags.length > 0
                ? post?.tags.map((tag, index) => (
                    <p key={index}>
                      {tag}
                      {post?.tags.length - 1 !== index && ","}
                    </p>
                  ))
                : "No tags"}
            </div>
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
              disabled={isLoadingDeletePost}
              onClick={() => {
                deletePostHandler({
                  slug: post?.slug,
                  token: userState.userInfo.token,
                });
              }}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <Link
              to={`/admin/posts/manage/edit/${post?.slug}`}
              className="text-green-600 hover:text-green-900"
            >
              Edit
            </Link>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};
export default ManagePosts;
