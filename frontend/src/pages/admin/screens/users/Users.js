import { Link } from "react-router-dom";
import { useDataTable } from "../../../../hooks/useDataTable";
import {
  deleteUser,
  getAllUsers,
  updateProfile,
} from "../../../../services/index/users";
import DataTable from "../../components/DataTable";
import { images } from "../../../../constants";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Users = () => {
  const {
    userState,
    currentPage,
    setCurrentPage,
    searchKeyWord,
    data: usersData,
    isLoading,
    isFetching,
    isLoadingDeleteData: isLoadingDeletePost,
    queryClient,
    deleteDataHandler: deleteUserHandler,
    searchKeyWordHandler,
    submitSearchKeyWordHandler,
  } = useDataTable({
    dataQueryFn: () => getAllUsers(userState.userInfo.token),
    dataQueryKey: "users",
    mutateDeleteFn: ({ slug, token }) => deleteUser({ slug, token }),
    deleteDataMessage: "User deleted successfully",
  });

  const { mutate: mutateUpdateUser, isLoading: isLoadingUpdateUser } =
    useMutation({
      mutationFn: ({ isAdmin, userId }) => {
        return updateProfile({
          token: userState.userInfo.token,
          userData: { admin: isAdmin },
          userId,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        toast.success("User is updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  const handleAdminChange = (event, userId) => {
    const initialCheckValue = !event.target.checked;
    if (window.confirm("Do you want to change the admin status of this user")) {
      mutateUpdateUser({ isAdmin: event.target.checked, userId });
    } else {
      event.target.checked = initialCheckValue;
    }
  };

  return (
    <DataTable
      dataListName="Manage Users"
      searchInputPlaceHolder="Search user here..."
      searchKeyWordOnSubmitHandler={submitSearchKeyWordHandler}
      searchKeyWordOnChangeHandler={searchKeyWordHandler}
      searchKeyWord={searchKeyWord}
      tableHeaderTitleList={[
        "Name",
        "Email",
        "Created At",
        "is Verified",
        "is Admin",
        "Actions",
      ]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={usersData?.data}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={usersData?.headers}
      // userState={userState}
    >
      {usersData?.data.map((user) => (
        <tr key={user?._id}>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to={`/blog/${user?.slug}`} className="relative block">
                  <img
                    alt={user?.name}
                    src={
                      user?.avatar
                        ? user?.avatar
                        : images.SampleProfileImage
                    }
                    className="mx-auto object-cover rounded-md aspect-square w-10 "
                  />
                </Link>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">{user?.name}</p>
              </div>
            </div>
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">{user?.email}</p>
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {user?.verified ? "✅" : "❌"}
            </p>
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            {/* <p className="text-gray-900 whitespace-no-wrap">
              {user?.admin ? "✅" : "❌"}
            </p> */}
            <input
              type="checkbox"
              className="disabled:bg-orange-400 disabled:opacity-100 checked:text-white checked:accent-green-500 checked:disabled:bg-none w-5 h-5"
              defaultChecked={user.admin}
              onChange={(e) => handleAdminChange(e, user._id)}
              disabled={isLoadingUpdateUser}
            />
          </td>

          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200 space-x-5">
            <button
              disabled={isLoadingDeletePost}
              onClick={() => {
                deleteUserHandler({
                  slug: user?._id,
                  token: userState.userInfo.token,
                });
              }}
              type="button"
              className="text-red-600 hover:text-red-900 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};
export default Users;
