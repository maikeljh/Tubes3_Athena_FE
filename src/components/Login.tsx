import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const Login = ({
  setUserId,
  setAuthenticated,
  setRegister,
}: {
  setUserId: (userId: number) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setRegister: (register: boolean) => void;
}) => {
  // Component states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle login process
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    // Try to login
    try {
      if (email === "" || password === "") throw new Error("Gagal Login");

      // Get all users
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
      });
      const data = await response.json();

      for (let user of data) {
        if (user.email === email && user.password === password) {
          setUserId(user.userId);
          setAuthenticated(true);
          toast.success("Berhasil Login");
          return;
        }
      }

      throw new Error("Gagal Login");
    } catch (e) {
      toast.error("Gagal Login. Pastikan semua input terisi dan sesuai!");
    }
  };

  return (
    <div className="flex flex-col mx-auto gap-8 bg-gray-800 text-white min-h-[100vh]">
      <h1 className="text-4xl text-center mt-20 sm:mt-24 font-bold">
        Welcome to Athena
      </h1>
      <form className="flex flex-col gap-4" onSubmit={(e) => handleLogin(e)}>
        <h2 className="text-center text-2xl font-bold">Login</h2>
        <div className="flex flex-col gap-2 mx-auto">
          <label>Email</label>
          <input
            type="text"
            className="text-black p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mx-auto">
          <label>Password</label>
          <input
            type="password"
            className="text-black p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="border-2 w-[12rem] p-4 mx-auto">
          Submit
        </button>
        <p className="mx-auto">
          Have no account yet?{" "}
          <span
            className="font-bold cursor-pointer"
            onClick={() => setRegister(true)}
          >
            Register
          </span>
        </p>
      </form>
      <button
        onClick={() => signIn("google")}
        type="button"
        className="border-2 w-[12rem] p-4 mx-auto mb-10"
      >
        Sign in With Google
      </button>
    </div>
  );
};

export default Login;
