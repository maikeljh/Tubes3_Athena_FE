import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const Register = ({
  setRegister,
}: {
  setRegister: (register: boolean) => void;
}) => {
  // Component states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Function to handle register process
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    // Try to add new user
    try {
      if (
        email === "" ||
        password === "" ||
        firstName === "" ||
        lastName === ""
      )
        throw new Error("Gagal Register");

      const body = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      };

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        if (response.ok) {
          // Do Nothing
        } else {
          throw new Error(response.statusText);
        }
      });

      toast.success("Berhasil Register");
      setRegister(false);
    } catch (e) {
      toast.error("Gagal Register! Pastikan semua input diisi!");
    }
  };

  return (
    <div className="flex flex-col mx-auto gap-8 bg-gray-800 text-white min-h-[100vh] sm:px-8">
      <h1 className="text-4xl text-center mt-14 sm:mt-28 font-bold">
        Welcome to Athena
      </h1>
      <form className="flex flex-col gap-6" onSubmit={(e) => handleRegister(e)}>
        <h2 className="text-center text-2xl font-bold">Register</h2>
        <div className="flex flex-col sm:flex-row mx-auto gap-4">
          <div className="flex flex-col gap-2 mx-auto">
            <label className="text-center">First Name</label>
            <input
              type="text"
              className="text-black p-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 mx-auto">
            <label className="text-center">Last Name</label>
            <input
              type="text"
              className="text-black p-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
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
        <div className="flex flex-row mx-auto gap-4 mb-10">
          <button
            type="button"
            className="border-2 sm:w-[12rem] p-4 mx-auto"
            onClick={() => setRegister(false)}
          >
            Cancel
          </button>
          <button type="submit" className="border-2 sm:w-[12rem] p-4 mx-auto">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
