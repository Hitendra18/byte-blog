import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import MainLayout from "../../components/MainLayout";
import { signup } from "../../services/index/users";
import { userActions } from "../../store/reducers/userReducers";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ name, email, password }) => {
      return signup({ name, email, password });
    },
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));
      console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    if (userState.userInfo) {
      navigate("/");
    }
  }, [navigate, userState.userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  const submitHandler = (data) => {
    // console.log(data);
    const { name, email, password } = data;
    mutate({ name, email, password });
  };
  return (
    <MainLayout>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="font-roboto text-2xl font-bold text-center text-dark-hard mb-8">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col mb-6 w-full">
              <label
                htmlFor="name"
                className="text-[#5A7184] font-semibold block"
              >
                Name
              </label>
              <input
                type="text"
                {...register("name", {
                  minLength: {
                    value: 1,
                    message: "Name length must be one character",
                  },
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                })}
                placeholder="Enter Name"
                id="name"
                className={`placeholder:text-[#959EAD] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block border outline-none ${
                  errors.name ? "border-red-500" : "border-[#C3CAD9]"
                }`}
              />
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col mb-6 w-full">
              <label
                htmlFor="email"
                className="text-[#5A7184] font-semibold block"
              >
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Enter a valid email",
                  },
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                })}
                placeholder="Enter Email"
                id="email"
                className={`placeholder:text-[#959EAD] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block border outline-none ${
                  errors.email ? "border-red-500" : "border-[#C3CAD9]"
                }`}
              />
              {errors.email?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col mb-6 w-full">
              <label
                htmlFor="password"
                className="text-[#5A7184] font-semibold block"
              >
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "Password length must be at least 6 character",
                  },
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
                placeholder="Enter Password"
                id="password"
                className={`placeholder:text-[#959EAD] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block border outline-none ${
                  errors.password ? "border-red-500" : "border-[#C3CAD9]"
                }`}
              />
              {errors.password?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col mb-6 w-full">
              <label
                htmlFor="confirmPassword"
                className="text-[#5A7184] font-semibold block"
              >
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Confirm password is required",
                  },
                  validate: (value) => {
                    if (value !== password) {
                      return "Passwords do not match";
                    }
                  },
                })}
                placeholder="Confirm Password"
                id="confirmPassword"
                className={`placeholder:text-[#959EAD] text-dark-hard mt-3 rounded-lg px-5 py-4 font-semibold block border outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-[#C3CAD9]"
                }`}
              />
              {errors.confirmPassword?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register
            </button>
          </form>
          <p className="text-sm font-semibold text-[#5A7184]">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login Now
            </Link>
          </p>
        </div>
      </section>
    </MainLayout>
  );
};
export default RegisterPage;
