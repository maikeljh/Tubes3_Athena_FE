import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import { stat } from "fs";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data, status } = useSession();
  if (status === "loading")
    return <h1 className="text-black"> loading... please wait</h1>;
  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Athena</title>
        </Head>
        <main className="max-h-[100vh] text-white">
          <div className="flex flex-row">
            <div className="w-1/5 bg-gray-800 h-[100vh] flex flex-col">
              <div className="border-[1px] border-gray rounded-xl p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer">
                + New Chat
              </div>
              <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                {[...Array(10)].map((e, i) => (
                  <span
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    key={i}
                  >
                    History ke-{i + 1}
                  </span>
                ))}
              </div>
              <div className="flex flex-col border-t-2">
                <div className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer">
                  Clear conversation
                </div>
                <div className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer">
                  Settings
                </div>
                <div className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer">
                  Get help
                </div>
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => signOut()}
                >
                  Log out
                </div>
              </div>
            </div>
            <div className="w-4/5 bg-gray-600 h-[100vh] flex flex-col gap-10 px-10">
              <h2 className="text-white text-5xl mx-auto font-semibold pt-24">
                Athena
              </h2>
              <div className="flex flex-row gap-8 mx-auto text-center">
                <div className="flex flex-col gap-4 text-xl">
                  <h3>Examples</h3>
                  <div className="flex flex-col gap-4 px-4">
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 text-xl">
                  <h3 className="text-center">Examples</h3>
                  <div className="flex flex-col gap-4 px-4">
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 text-xl">
                  <h3 className="text-center">Examples</h3>
                  <div className="flex flex-col gap-4 px-4">
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                    <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                      {
                        "Lorem ipsum, atau ringkasnya lipsum, adalah teks standar yang ditempatkan"
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <textarea
                  className="w-full bg-gray-800 p-4 rounded-xl scrollbar-thin scrollbar-thumb-gray-700"
                  style={{ resize: "none" }}
                  placeholder="Send a message"
                />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
  return (
    <div className="flex flex-col mx-auto gap-8 bg-gray-800 text-white h-[100vh]">
      <h1 className="text-4xl text-center mt-40 font-bold">
        Welcome to Athena
      </h1>
      <button
        onClick={() => signIn("google")}
        className="border-2 w-[12rem] p-4 mx-auto"
      >
        Sign in With Google
      </button>
    </div>
  );
}
