import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const Register = ({
  setRegister,
}: {
  setRegister: (register: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    // Get all users
    const currentUsers = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        method: "GET",
      }
    );
    const data = await currentUsers.json();

    for (let user of data) {
      if (user.email === email) {
        toast.error("Email sudah terdaftar!");
        return;
      }
    }

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
    });

    toast.success("Berhasil Register");
    setRegister(false);
  };

  return (
    <div className="flex flex-col mx-auto gap-8 bg-gray-800 text-white min-h-[100vh]">
      <h1 className="text-4xl text-center mt-28 font-bold">
        Welcome to Athena
      </h1>
      <form className="flex flex-col gap-6" onSubmit={(e) => handleRegister(e)}>
        <h2 className="text-center text-2xl font-bold">Register</h2>
        <div className="flex flex-row mx-auto gap-4">
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
        <div className="flex flex-row mx-auto gap-4">
          <button
            type="button"
            className="border-2 w-[12rem] p-4 mx-auto"
            onClick={() => setRegister(false)}
          >
            Cancel
          </button>
          <button type="submit" className="border-2 w-[12rem] p-4 mx-auto">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
