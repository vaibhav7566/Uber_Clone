import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { signupUser } from "../features/auth/authAPI";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// 1. form with react-hook-form
// 2. on submit, call signup API
// 3. if success, save user and token in redux
// 4. show success toast
// 5. navigate to dashboard
// 6. if error, show error toast
// Bonus: role based navigation

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

      // ✅ role based redirect (same as login)
      if (user.role === "DRIVER") {
        navigate("/driver/dashboard", { replace: true });
      } else {
        navigate("/rider/home", { replace: true });  //  replace: true to prevent going back to signup on back button and removse the signup page from history stack
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Signup</h2>

        <input
          {...register("name")}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <input
          {...register("phone")}
          placeholder="Phone"
          className="w-full border p-2 rounded"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Signup
        </button>

        {/* signup link */}
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;

// import { useForm } from "react-hook-form"
// import { useDispatch } from "react-redux"
// import { setCredentials } from "../features/auth/authSlice"
// import { signupUser } from "../features/auth/authAPI"
// import { toast } from "react-toastify"
// import { Link, useNavigate } from "react-router-dom"
// import { useState } from "react"

// function Signup() {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm()
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [role, setRole] = useState("RIDER")

//   const onSubmit = async (data) => {
//     setLoading(true)
//     try {
//       const res = await signupUser({ ...data, role })
//       const { user, token } = res.data.data
//       dispatch(setCredentials({ user, token }))
//       toast.success("Signup successful 🎉")
//       reset()
//       if (user.role === "DRIVER") {
//         navigate("/driver/dashboard")
//       } else {
//         navigate("/rider/home")
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Signup failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">

//       {/* Background glow effects */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-yellow-400 opacity-5 blur-3xl pointer-events-none" />
//       <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-yellow-500 opacity-5 blur-3xl pointer-events-none" />

//       {/* Grid overlay */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
//           backgroundSize: "40px 40px",
//         }}
//       />

//       <div className="w-full max-w-md relative z-10">

//         {/* Logo / Brand */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center gap-2 mb-3">
//             <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30">
//               <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
//                 <circle cx="7.5" cy="14.5" r="1.5" />
//                 <circle cx="16.5" cy="14.5" r="1.5" />
//               </svg>
//             </div>
//             <span
//               className="text-white text-2xl font-black tracking-tight"
//               style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.05em" }}
//             >
//               swift<span className="text-yellow-400">.</span>
//             </span>
//           </div>
//           <p className="text-zinc-500 text-sm tracking-widest uppercase font-medium">Your ride, reimagined</p>
//         </div>

//         {/* Card */}
//         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 select-none">

//           <h2 className="text-white text-2xl font-bold mb-1 tracking-tight">Create account</h2>
//           <p className="text-zinc-500 text-sm mb-6">Join thousands already riding smarter.</p>

//           {/* Role Toggle */}
//           <div className="flex bg-zinc-800 rounded-xl p-1 mb-6 gap-1">
//             {["RIDER", "DRIVER"].map((r) => (
//               <button
//                 key={r}
//                 type="button"
//                 onClick={() => setRole(r)}
//                 className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
//                   role === r
//                     ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20"
//                     : "text-zinc-400 hover:text-white"
//                 }`}
//               >
//                 {r === "RIDER" ? "🚗  I'm a Rider" : "🧑‍✈️  I'm a Driver"}
//               </button>
//             ))}
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

//             {/* Name */}
//             <div className="space-y-1">
//               <label className="text-zinc-400 text-xs uppercase tracking-widest font-medium">Full Name</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </span>
//                 <input
//                   {...register("name", { required: "Name is required" })}
//                   placeholder="John Doe"
//                   className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 select-text text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition-all"
//                 />
//               </div>
//               {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
//             </div>

//             {/* Email */}
//             <div className="space-y-1">
//               <label className="text-zinc-400 text-xs uppercase tracking-widest font-medium">Email</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </span>
//                 <input
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" }
//                   })}
//                   placeholder="you@example.com"
//                   className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 select-text text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition-all"
//                 />
//               </div>
//               {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
//             </div>

//             {/* Phone */}
//             <div className="space-y-1">
//               <label className="text-zinc-400 text-xs uppercase tracking-widest font-medium">Phone</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                   </svg>
//                 </span>
//                 <input
//                   {...register("phone", { required: "Phone is required" })}
//                   placeholder="+91-000-000-0000"
//                   className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-xl pl-10 pr-4 py-3 select-text text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition-all"
//                 />
//               </div>
//               {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
//             </div>

//             {/* Password */}
//             <div className="space-y-1">
//               <label className="text-zinc-400 text-xs uppercase tracking-widest font-medium">Password</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </span>
//                 <input
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: { value: 6, message: "At least 6 characters" }
//                   })}
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Min. 6 characters"
//                   className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-xl pl-10 pr-10 py-3 select-text text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition-all"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
//                 >
//                   {showPassword ? (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
//             </div>

//             {/* Terms */}
//             <p className="text-zinc-600 text-xs leading-relaxed">
//               By creating an account, you agree to our{" "}
//               <span className="text-yellow-400 cursor-pointer hover:underline">Terms of Service</span> and{" "}
//               <span className="text-yellow-400 cursor-pointer hover:underline">Privacy Policy</span>.
//             </p>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2 mt-2"
//             >
//               {loading ? (
//                 <>
//                   <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
//                   </svg>
//                   Creating account...
//                 </>
//               ) : (
//                 <>
//                   Get Started
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                   </svg>
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="flex items-center my-5 gap-3">
//             <div className="flex-1 h-px bg-zinc-800" />
//             <span className="text-zinc-600 text-xs">or continue with</span>
//             <div className="flex-1 h-px bg-zinc-800" />
//           </div>

//           {/* Social - Google only, full width */}
//           <button
//             type="button"
//             className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-medium py-2.5 rounded-xl transition-colors"
//           >
//             <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
//               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//             </svg>
//             Continue with Google
//           </button>

//           <p className="text-center text-zinc-500 text-sm mt-6">
//             Already have an account?{" "}
//             <Link to="/login" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
//               Sign in
//             </Link>
//           </p>
//         </div>

//         {/* Footer note */}
//         <p className="text-center text-zinc-700 text-xs mt-4">
//           🔒 256-bit encrypted · Your data stays private
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Signup
