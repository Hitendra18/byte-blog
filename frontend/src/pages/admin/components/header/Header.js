import { Link, useNavigate } from "react-router-dom";
import { images } from "../../../../constants";
import { useEffect, useState } from "react";
import { AiFillDashboard, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaComments, FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createPost } from "../../../../services/index/posts";

const Header = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeNavName, setActiveNavName] = useState("dashboard");
  const windowSize = useWindowSize();
  const userState = useSelector((state) => state.user);

  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } =
    useMutation({
      mutationFn: ({ token }) => {
        return createPost({ token });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"]);
        toast.success("New sample post is created, you can edit it now!");
        navigate(`/admin/posts/manage/edit/${data.slug}`);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const toggleMenuHandler = () => {
    setIsMenuActive((preState) => !preState);
  };

  useEffect(() => {
    if (windowSize.width < 1024) {
      setIsMenuActive(false);
    } else {
      setIsMenuActive(true);
    }
  }, [windowSize.width]);

  const handleCreateNewPost = ({ token }) => {
    mutateCreatePost({ token });
  };

  return (
    <header className="flex h-fit w-full items-center justify-between p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0 relative z-[100]">
      {/* Logo */}
      <Link to="/">
        <img src={images.Logo} alt="logo" className="w-24 lg:hidden" />
      </Link>
      {/* Menu Icon */}
      <div className="cursor-pointer lg:hidden">
        {isMenuActive ? (
          <AiOutlineClose onClick={toggleMenuHandler} className="w-6 h-6" />
        ) : (
          <AiOutlineMenu onClick={toggleMenuHandler} className="w-6 h-6" />
        )}
      </div>
      {/* Sidebar container */}
      {isMenuActive && (
        <div className="fixed inset-0 lg:static lg:h-full lg:w-full">
          {/* underlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 lg:hidden"
            onClick={toggleMenuHandler}
          />
          {/* sidebar */}
          <div className="fixed top-0 bottom-0 left-0 z-50 w-3/4 overflow-y-auto bg-white p-5 lg:static lg:h-full lg:w-full lg:p-6 lg:bg-[#F9F9F9]">
            <Link to="/">
              <img src={images.Logo} alt="Logo" className="w-24" />
            </Link>
            <h4 className="mt-10 font-bold text-[#C7C7C7]">Main Menu</h4>
            {/* Menu Items */}
            <div className="mt-6 flex flex-col gap-y-[0.563rem]">
              {/* <NavItem
                title="Dashboard"
                link="/admin"
                icon={<AiFillDashboard className="text-xl" />}
                name="dashboard"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              /> */}

              <NavItem
                title="Comments"
                link="/admin/comments"
                icon={<FaComments className="text-xl" />}
                name="comments"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />

              <NavItemCollapse
                title="Posts"
                name="posts"
                icon={<MdDashboard className="text-xl" />}
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              >
                <Link to="/admin/posts/manage">Manage all posts</Link>
                <button
                  disabled={isLoadingCreatePost}
                  className="text-start disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() =>
                    handleCreateNewPost({ token: userState.userInfo.token })
                  }
                >
                  Add new post
                </button>
                <Link to="/admin/categories/manage">Categories</Link>
              </NavItemCollapse>

              <NavItem
                title="Users"
                link="/admin/users/manage"
                icon={<FaUser className="text-xl" />}
                name="users"
                activeNavName={activeNavName}
                setActiveNavName={setActiveNavName}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
