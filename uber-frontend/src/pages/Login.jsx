import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { loginUser } from "../features/auth/authAPI";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

// 1. form with react-hook-form
// 2. on submit, call login API
// 3. if success, save user and token in redux
// 4. show success toast
// 5. navigate to dashboard
// 6. if error, show error toast
// Bonus: role based navigation
// if user is driver, navigate to driver dashboard
// if user is rider, navigate to rider home
// Bonus: allow login with email or phone (detect based on presence of @ in identifier)

function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const payload = {
        password: data.password,
      };

      // detect email or phone
      if (data.identifier.includes("@")) {
        payload.email = data.identifier;
      } else {
        payload.phone = data.identifier;
      }

      const res = await loginUser(payload);

      const { user, token } = res.data.data;
      dispatch(setCredentials({ user, token }));

      toast.success("Login successful 🎉");

      // role based navigation
      if (user.role === "DRIVER") {
        navigate("/driver/dashboard", { replace: true });
      } else {
        navigate("/rider/home", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          {...register("identifier")}
          placeholder="Email or Phone"
          className="w-full border p-2 rounded"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>

        {/* signup link */}
        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/" className="text-blue-600 font-semibold">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
