import { Link } from "react-router-dom";
import { images } from "../../../../constants";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteComment,
  getAllComments,
  updateComment,
} from "../../../../services/index/comments";
import DataTable from "../../components/DataTable";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Comments = () => {
  const {
    userState,
    currentPage,
    setCurrentPage,
    searchKeyWord,
    data: commentsData,
    isLoading,
    isFetching,
    isLoadingDeleteData: isLoadingDeleteComment,
    queryClient,
    deleteDataHandler: deleteCommentHandler,
    searchKeyWordHandler,
    submitSearchKeyWordHandler,
  } = useDataTable({
    dataQueryFn: () =>
      getAllComments(userState.userInfo.token, searchKeyWord, currentPage),
    dataQueryKey: "comments",
    mutateDeleteFn: ({ slug, token }) =>
      deleteComment({ token, commentId: slug }),
    deleteDataMessage: "Comment is deleted successfully",
  });

  const {
    mutate: mutateUpdateCommentCheck,
    isLoading: isLoadingUpdateCommentCheck,
  } = useMutation({
    mutationFn: ({ token, check, commentId }) =>
      updateComment({ token, check, commentId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["comments"]);
      toast.success(
        data?.check ? "Comment is approved..." : "Comment is unapproved..."
      );
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  return (
    <DataTable
      dataListName="Manage Comments"
      searchInputPlaceHolder="Search comment here..."
      searchKeyWordOnSubmitHandler={submitSearchKeyWordHandler}
      searchKeyWordOnChangeHandler={searchKeyWordHandler}
      searchKeyWord={searchKeyWord}
      tableHeaderTitleList={[
        "Author",
        "Comment",
        "In Respond to",
        "Created At",
        "Actions",
      ]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={commentsData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={commentsData?.headers}
    >
      {commentsData?.data.map((comment) => (
        <tr>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link
                  to={`/blog/${comment?.post?.slug}`}
                  className="relative block"
                >
                  <img
                    alt={comment?.user?.name}
                    src={
                      comment?.user?.avatar
                        ? comment?.user?.avatar
                        : images.SampleProfileImage
                    }
                    className="mx-auto object-cover rounded-md aspect-square w-10 "
                  />
                </Link>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">
                  {comment?.user?.name}
                </p>
              </div>
            </div>
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-y-2">
            {comment?.replyOnUser !== null && (
              <p className="text-gray-900 whitespace-no-wrap text-xs">
                In reply to{" "}
                <Link
                  to={`/blog/${comment?.post?.slug}#comment-${comment?._id}`}
                  className="text-blue-500"
                >
                  {comment?.replyOnUser?.name}
                </Link>{" "}
                :
              </p>
            )}
            <p className="text-gray-900 whitespace-no-wrap">{comment?.desc}</p>
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-y-2">
            <p className="whitespace-no-wrap text-blue-500">
              <Link to={`/blog/${comment?.post?.slug}`}>
                {comment?.post?.title}
              </Link>
            </p>
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-y-2">
            <p className="whitespace-no-wrap text-blue-500">
              {new Date(comment?.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
              disabled={isLoadingDeleteComment}
              onClick={() => {
                mutateUpdateCommentCheck({
                  token: userState.userInfo.token,
                  check: comment?.check ? false : true,
                  commentId: comment?._id,
                });
              }}
              type="button"
              className={`${comment?.check ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {comment?.check ? "Unapprove" : "Approve"}
            </button>
            <button
              disabled={isLoadingDeleteComment}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={() =>
                deleteCommentHandler({
                  slug: comment?._id,
                  token: userState.userInfo.token,
                })
              }
            >
              Delete
            </button>
          </td>

          {/* <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
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
          </td> */}
        </tr>
      ))}
    </DataTable>
  );
};
export default Comments;
