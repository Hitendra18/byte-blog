import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import HomePage from "./pages/home/HomePage";
import ArticleDetails from "./pages/articleDetails/ArticleDetails";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AdminLayout from "./pages/admin/AdminLayout";
import Admin from "./pages/admin/screens/Admin";
import Comments from "./pages/admin/screens/comments/Comments";
import ManagePosts from "./pages/admin/screens/posts/ManagePosts";
import EditPost from "./pages/admin/screens/posts/EditPost";
import Categories from "./pages/admin/screens/categories/Categories";
import EditCategory from "./pages/admin/screens/categories/EditCategory";
import Users from "./pages/admin/screens/users/Users";
import BlogPage from "./pages/blog/BlogPage";

export default function App() {
  return (
    <div className="font-openSans">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticleDetails />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="comments" element={<Comments />} />
          <Route path="posts/manage" element={<ManagePosts />} />
          <Route path="posts/manage/edit/:slug" element={<EditPost />} />
          <Route path="categories/manage" element={<Categories />} />
          <Route path="users/manage" element={<Users />} />
          <Route
            path="categories/manage/edit/:slug"
            element={<EditCategory />}
          />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}
