// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "../features/auth/authSlice";
// import { signupUser } from "../features/auth/authAPI";
// import { toast } from "react-toastify";
// import { Link, useNavigate } from "react-router-dom";

// // 1. form with react-hook-form
// // 2. on submit, call signup API
// // 3. if success, save user and token in redux
// // 4. show success toast
// // 5. navigate to dashboard
// // 6. if error, show error toast
// // Bonus: role based navigation

// function Signup() {
//   const { register, handleSubmit, reset } = useForm();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//     try {
//       const res = await signupUser(data);

//       const { user, token } = res.data.data;
//       dispatch(setCredentials({ user, token }));

//       toast.success("Signup successful 🎉");
//       reset();

//       // ✅ role based redirect (same as login)
//       if (user.role === "DRIVER") {
//         navigate("/driver/dashboard", { replace: true });
//       } else {
//         navigate("/rider/home", { replace: true });  //  replace: true to prevent going back to signup on back button and removse the signup page from history stack
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="h-screen flex items-center justify-center bg-black">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="bg-white p-8 rounded-xl w-96 space-y-4"
//       >
//         <h2 className="text-2xl font-bold text-center">Signup</h2>

//         <input
//           {...register("name")}
//           placeholder="Name"
//           className="w-full border p-2 rounded"
//         />

//         <input
//           {...register("email")}
//           placeholder="Email"
//           className="w-full border p-2 rounded"
//         />

//         <input
//           {...register("phone")}
//           placeholder="Phone"
//           className="w-full border p-2 rounded"
//         />

//         <input
//           {...register("password")}
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 rounded"
//         />

//         <button className="w-full bg-black text-white p-2 rounded">
//           Signup
//         </button>

//         {/* signup link */}
//         <p className="text-center text-sm">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 font-semibold">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Signup;

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { signupUser } from "../features/auth/authAPI";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await signupUser(data);
      const { user, token } = res.data.data;
      dispatch(setCredentials({ user, token }));
      toast.success("Signup successful 🎉");
      reset();
      if (user.role === "DRIVER") {
        navigate("/driver/dashboard", { replace: true });
      } else {
        navigate("/rider/home", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ fontFamily: "'Uber Move', 'UberMoveText', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
      className="min-h-screen bg-white flex flex-col">

      {/* Top Nav - sticky */}
      <header className="bg-black px-6 py-4 sticky top-0 z-50">
        <span className="text-white text-2xl font-bold tracking-tight">Uber</span>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          {/* Title + Quote */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black leading-tight mb-2">
              Create your account
            </h2>
            <p className="text-gray-500 text-sm">
              "Your destination is waiting — let's get you there."
            </p>
          </div>

          {/* Full Name */}
          <div>
            <input
              {...register("name")}
              placeholder="Full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
            />
          </div>

          {/* Phone */}
          <div>
            <input
              {...register("phone")}
              placeholder="Phone number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
            />
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-black hover:bg-zinc-800 text-white font-semibold py-3.5 px-6 rounded-lg text-base transition-colors duration-200 mt-2"
          >
            Sign up
          </button> 

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-black font-medium py-3.5 px-6 rounded-lg text-base transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
            </svg>
            Continue with Google
          </button>

          {/* Legal */}
          <p className="text-xs text-gray-400 text-center pt-1">
            By continuing, you agree to our{" "}
            <span className="underline cursor-pointer">Terms</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 pt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-black font-semibold underline hover:no-underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;