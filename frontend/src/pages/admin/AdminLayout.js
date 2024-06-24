import { Outlet, useNavigate } from "react-router-dom";
import Header from "./components/header/Header";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../services/index/users";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const userState = useSelector((state) => state.user);
  const navigate = useNavigate();

  const onSuccess = () => {
    navigate("/");
    toast.error("You are not allowed to access admin panel");
  };

  const { isLoading: profileIsLoading } = useQuery({
    queryFn: () => {
      return getUserProfile({
        token: userState.userInfo.token,
        adminCheck: true,
        successFn: onSuccess,
      });
    },
    queryKey: ["profile"],
  });

  if (profileIsLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h3 className="text-2xl text-slate-700">Loading...</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <Header />
      <main className="flex-1 p-4 lg:p-6 bg-fixed">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
