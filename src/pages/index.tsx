import Head from "next/head";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";
import Login from "@/components/Login";
import Athena from "@/components/Athena";
import Register from "@/components/Register";

export default function Home() {
  const { data, status } = useSession();
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState(0);
  const [register, setRegister] = useState(false);

  return (
    <>
      <Head>
        <title>Athena</title>
      </Head>
      {status === "loading" ? (
        <Loading />
      ) : status === "authenticated" || authenticated ? (
        <Athena
          userId={userId}
          data={data}
          setAuthenticated={setAuthenticated}
          status={status}
        />
      ) : register ? (
        <Register setRegister={setRegister} />
      ) : (
        <Login
          setUserId={setUserId}
          setAuthenticated={setAuthenticated}
          setRegister={setRegister}
        />
      )}
      <ToastContainer />
    </>
  );
}
