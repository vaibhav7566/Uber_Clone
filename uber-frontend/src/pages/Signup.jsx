import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { setCredentials } from "../features/auth/authSilce"
import { signupUser } from "../features/auth/authAPI"
import { toast } from "react-toastify"

function Signup() {
  const { register, handleSubmit, reset } = useForm()
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    try {
      const res = await signupUser(data)

      const { user, token } = res.data.data
      dispatch(setCredentials({ user, token }))

      toast.success("Signup successful 🎉")
      reset()

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed")
    }
  }

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
      </form>
    </div>
  )
}

export default Signup