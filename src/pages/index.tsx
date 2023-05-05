import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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

  // UseEffect to handle authentication
  useEffect(() => {
    const handleRegister = async () => {
      if (data != null && !authenticated) {
        try {
          // Get all users
          const currentUsers = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users`,
            {
              method: "GET",
            }
          );
          const users = await currentUsers.json();

          for (let user of users) {
            if (user.email === data.user?.email) {
              setUserId(user.userId);
              setAuthenticated(true);
              return;
            }
          }

          const names = data.user?.name?.split(" ");
          const firstName =
            names && names.length > 0 ? names[0] : "Unknown User";
          const lastName =
            names && names.length > 1 ? names[names.length - 1] : "";

          const body = {
            email: data.user?.email,
            password: "",
            firstName: firstName,
            lastName: lastName,
          };

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          }).then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(response.statusText);
            }
          });
          setAuthenticated(true);
          setUserId(res.userId);
        } catch (e) {
          console.log(e);
        }
      }
    };

    if (status === "authenticated") {
      handleRegister();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <>
      <Head>
        <title>Athena</title>
        <meta
          name="description"
          content="Chat Bot Application made by Athena"
        />
        <meta name="og:card" content="summary" />
        <meta name="og:title" content="Athena" />
        <meta name="og:image" content="/img/bot.png" />
        <meta
          name="og:description"
          content="Chat Bot Application made by Athena"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Athena" />
        <meta
          name="twitter:description"
          content="Chat Bot Application made by Athena"
        />
        <meta name="twitter:image" content="/img/bot.png" />
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
