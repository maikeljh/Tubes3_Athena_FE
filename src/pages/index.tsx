import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import Bot from "../public/img/bot.png";
import { FormEvent, Ref, useEffect, useRef, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

interface History {
  id: number;
  name: string;
}

interface Message {
  history_id: number;
  user_message: string;
  bot_message: string;
  timestamp: number;
}

export default function Home() {
  const { data, status } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedHistory, setSelectedHistory] = useState(0);
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [message, setMessage] = useState<Message[]>([]);
  const [afterAsk, setAfterAsk] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Submit form when Enter key is pressed and Shift key is not held down
      submitQuestion(e);
    }
  };

  const submitQuestion = (e: FormEvent) => {
    e.preventDefault();
    if (question === "") {
      // Do nothing
    } else {
      setAfterAsk(true);
      if (selectedHistory === 0) {
        let newID = history.length + 1;
        const newHistory: History = {
          id: newID,
          name: "History " + newID,
        };
        let tempHistories = [...history];
        tempHistories.push(newHistory);
        setHistory(tempHistories);
        setSelectedHistory(newID);

        const temp: Message = {
          history_id: newID,
          user_message: question,
          bot_message: "mana saya tahu, kok nanya saya",
          timestamp: 1,
        };
        let tempMessages = [...message];
        tempMessages.push(temp);
        setQuestion("");
        setMessage(tempMessages);
      } else {
        const temp: Message = {
          history_id: selectedHistory,
          user_message: question,
          bot_message: "mana saya tahu, kok nanya saya",
          timestamp: 1,
        };
        let tempMessages = [...message];
        tempMessages.push(temp);
        setQuestion("");
        setMessage(tempMessages);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  // Scroll to the bottom of the chat window
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (status === "loading")
    return <h1 className="text-black">Loading... please wait</h1>;
  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Athena</title>
        </Head>
        <main className="text-white">
          <div className="flex flex-row">
            <div className="w-1/5 fixed left-0 top-0">
              <div className="bg-gray-800 h-[100vh] flex flex-col">
                <div
                  className="border-[1px] border-gray rounded-xl p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => setSelectedHistory(0)}
                >
                  + New Chat
                </div>
                <div className="min-h-[50%] h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                  {history.map((e: History, i) => (
                    <span
                      className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                      key={i}
                      onClick={() => {
                        setSelectedHistory(-1);
                        setAfterAsk(false);
                        setTimeout(() => setSelectedHistory(e.id), 500);
                      }}
                    >
                      {e.name}
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
            </div>
            <div className="ml-[20%] w-4/5 relative bg-gray-600 min-h-[100vh]">
              {selectedHistory == -1 ? (
                <div className="min-h-[100vh] bg-gray-700"></div>
              ) : selectedHistory == 0 ||
                message.filter((el) => el.history_id === selectedHistory)
                  .length === 0 ? (
                <div className="flex flex-col gap-10 px-10">
                  <h2 className="text-white text-5xl mx-auto font-semibold pt-24">
                    Athena
                  </h2>
                  <div className="flex flex-row gap-8 mx-auto text-center">
                    <div className="flex flex-col gap-4 text-xl w-full">
                      <h3>Examples</h3>
                      <div className="flex flex-col gap-4 px-4">
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {"Apa ibukota negara Indonesia?"}
                        </div>
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {"Berapa 9 + 10?"}
                        </div>
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {"Makanan terenak di dunia?"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 text-xl w-full">
                      <h3 className="text-center">Capabilities</h3>
                      <div className="flex flex-col gap-4 px-4">
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {"Melakukan operasi kalkulator"}
                        </div>
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {
                            "Menjawab pertanyaan secara umum sesuai pertanyaan yang terdaftar"
                          }
                        </div>
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {"Mendaftarkan pertanyaan dan jawaban baru dari Anda"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 text-xl w-full">
                      <h3 className="text-center">Limitations</h3>
                      <div className="flex flex-col gap-4 px-4">
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {"Kosakata yang digunakan terbatas"}
                        </div>
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {"Pertanyaan yang bisa dijawab masih sangat terbatas"}
                        </div>
                        <div className="bg-gray-800 text-lg mx-auto p-4 rounded-xl">
                          {"Hanya bahasa Indonesia"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                </div>
              ) : (
                <>
                  <div className="min-h-[100vh] bg-gray-700">
                    <div className="flex flex-col">
                      {message.length > 0 &&
                        message
                          .filter((el) => el.history_id === selectedHistory)
                          .map((e, i) => (
                            <div key={i}>
                              <div className="p-8 px-40 flex flex-row gap-8">
                                <div className="flex-shrink-0">
                                  <Image
                                    src={data.user?.image || Bot}
                                    alt={data.user?.name || "user"}
                                    width={40}
                                    height={30}
                                  />
                                </div>
                                <p>{e.user_message}</p>
                              </div>
                              <div className="p-8 px-40 flex flex-row gap-8 bg-gray-600">
                                <div className="flex-shrink-0">
                                  <Image
                                    src={Bot}
                                    alt="bot"
                                    width={40}
                                    height={30}
                                  />
                                </div>
                                {afterAsk &&
                                i ==
                                  message.filter(
                                    (el) => el.history_id === selectedHistory
                                  ).length -
                                    1 ? (
                                  <Typewriter
                                    words={[e.bot_message]}
                                    cursorBlinking={false}
                                  />
                                ) : (
                                  <p>{e.bot_message}</p>
                                )}
                              </div>
                            </div>
                          ))}
                    </div>
                    <div
                      className="w-full h-32 md:h-48 bg-gray-700"
                      ref={messagesEndRef}
                    ></div>
                  </div>
                </>
              )}
              <div className="fixed bottom-4 w-4/5">
                <form
                  className="w-2/3 mx-auto"
                  onSubmit={(e) => submitQuestion(e)}
                >
                  <textarea
                    className="w-full bg-gray-800 p-4 rounded-xl scrollbar-thin scrollbar-thumb-gray-700"
                    style={{ resize: "none" }}
                    placeholder="Send a message"
                    onKeyDown={handleKeyDown}
                    value={question}
                    onChange={(e) => {
                      setQuestion(e.target.value);
                    }}
                  />
                </form>
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
