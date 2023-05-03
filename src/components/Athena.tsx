import Image from "next/image";
import { signOut } from "next-auth/react";
import Bot from "../public/img/bot.png";
import User from "../public/img/user.jpg";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Setting from "@/components/Setting";
import Help from "@/components/Help";
import {
  FaArrowDown,
  FaPlus,
  FaBars,
  FaWindowClose,
  FaTelegramPlane,
  FaTrashAlt,
  FaPencilAlt,
  FaCheck,
} from "react-icons/fa";
import { Session } from "next-auth";
import ModalConfirm from "./ModalConfirm";
import { toast } from "react-toastify";
import { FidgetSpinner, TailSpin, ThreeDots } from "react-loader-spinner";

interface History {
  historyId: number;
  userId: number;
  topic: string;
}

interface Message {
  historyId: number;
  userMessage: string;
  botMessage: string;
  timestamp: number;
  userId: number;
}

const Athena = ({
  userId,
  data,
  setAuthenticated,
  status,
}: {
  userId: number;
  data: Session | null;
  setAuthenticated: (authenticated: boolean) => void;
  status: string;
}) => {
  const [algorithm, setAlgorithm] = useState("kmp");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedHistory, setSelectedHistory] = useState(0);
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [message, setMessage] = useState<Message[]>([]);
  const [afterAsk, setAfterAsk] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const [editTopic, setEditTopic] = useState(false);
  const [isNewHistory, setIsNewHistory] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [triggerGetHistories, setTriggerGetHistories] = useState(false);
  const [deleteHistoryElement, setDeleteHistoryElement] = useState<History>({
    historyId: 0,
    userId: 0,
    topic: "",
  });

  const searchTopic = (historyId: number): string => {
    for (let el of history) {
      if (el.historyId === historyId) {
        return el.topic;
      }
    }
    // Not found
    return "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
      // Submit form when Enter key is pressed and Shift key is not held down
      if (!loading) {
        setLoading(true);
        submitQuestion(e);
      }
    }
  };

  const submitQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (question !== "") {
      const body = {
        userMessage: question,
      };

      try {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/message/${userId}/${selectedHistory}?algo=${algorithm}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          }
        ).then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.statusText);
          }
        });
        setMessage(data);
        setAfterAsk(true);
        if (selectedHistory === 0) {
          setLoadingHistory(true);
          setIsNewHistory(true);
          setTriggerGetHistories(!triggerGetHistories);
        }
        setSelectedHistory(data[0].historyId);
        setQuestion("");
        setLoading(false);
      } catch (e) {
        toast.error("Gagal tambah pertanyaan!");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const deleteHistories = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history/${userId}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          // Do Nothing
        } else {
          throw new Error(response.statusText);
        }
      });
      setTriggerGetHistories(!triggerGetHistories);
      setMessage([]);
      setHistory([]);
      setSelectedHistory(0);
      setQuestion("");
      toast.success("Berhasil delete seluruh history!");
      setLoadingHistory(false);
    } catch (e) {
      toast.error("Gagal delete seluruh history!");
      setLoadingHistory(false);
    }
  };

  const deleteHistory = async (e: FormEvent, historyId: number) => {
    e.preventDefault();
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/history/${userId}/${historyId}`,
        {
          method: "DELETE",
        }
      ).then((response) => {
        if (response.ok) {
          // Do Nothing
        } else {
          throw new Error(response.statusText);
        }
      });
      setTriggerGetHistories(!triggerGetHistories);
      if (selectedHistory === historyId) {
        setMessage([]);
        setHistory([]);
        setSelectedHistory(0);
        setQuestion("");
      }
      toast.success(`Berhasil delete history!`);
      setLoadingHistory(false);
    } catch (e) {
      toast.error(`Gagal delete history!`);
      setLoadingHistory(false);
    }
  };

  const updateHistory = async (e: FormEvent, historyId: number) => {
    e.preventDefault();
    try {
      const body = {
        topic: newTopic,
      };

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/history/${userId}/${historyId}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        }
      ).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      });

      result.sort(function (a: History, b: History) {
        return b.historyId - a.historyId;
      });

      setHistory(result.slice(0, 10));
      toast.success(`Berhasil update history!`);
      setLoadingHistory(false);
    } catch (e) {
      toast.error(`Gagal update history!`);
      setLoadingHistory(false);
    }
  };

  // Scroll to the bottom of the chat window
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const getHistories = async () => {
      try {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/history/${userId}`,
          {
            method: "GET",
          }
        ).then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error(res.statusText);
          }
        });

        if (data.length > 0) {
          data.sort(function (a: History, b: History) {
            return b.historyId - a.historyId;
          });
        }

        setHistory(data.slice(0, 10));
        setLoadingHistory(false);
        return data;
      } catch (error) {
        console.error(error);
        setLoadingHistory(false);
        return [];
      }
    };
    if (userId != 0) getHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, triggerGetHistories]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/message/${userId}/${selectedHistory}`,
          {
            method: "GET",
          }
        ).then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error(res.statusText);
          }
        });
        setMessage(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedHistory > 0) getMessages();
    else setMessage([]);
  }, [selectedHistory, userId]);

  useEffect(() => {
    if (message.filter((el) => el.historyId === selectedHistory).length > 1) {
      scrollToBottom();
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [message, selectedHistory]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + window.scrollY - document.body.offsetHeight;
      setIsAtBottom(scrollPosition > -50);
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpenSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollPosition =
      window.innerHeight + window.scrollY - document.body.offsetHeight;
    setIsAtBottom(scrollPosition > -50);
    if (message.filter((el) => el.historyId === selectedHistory).length > 1) {
      scrollToBottom();
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [selectedHistory, message]);

  return (
    <>
      <main className="text-white">
        <nav className="absolute sticky top-0 w-full md:hidden bg-gray-800 flex flex-row p-4 z-[999] items-center">
          <div
            className="flex-none"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <FaBars className="mr-auto hover:cursor-pointer" />
          </div>
          <h1 className="text-center mx-2 flex-1 break-all">
            {selectedHistory === 0
              ? "New Chat"
              : selectedHistory === -1
              ? ""
              : `${
                  searchTopic(selectedHistory).length > 20
                    ? searchTopic(selectedHistory).slice(0, 20) + "..."
                    : searchTopic(selectedHistory)
                }`}
          </h1>
          <div
            className="flex-none"
            onClick={() => {
              setSelectedHistory(0);
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }}
          >
            <FaPlus className="ml-auto hover:cursor-pointer" />
          </div>
        </nav>
        <div className="md:flex md:flex-row">
          <div
            className={`md:hidden min-w-[12rem] w-3/5 md:w-1/5 fixed top-0 left-0 z-[9999] transition-transform duration-500 ${
              openSidebar ? "transform translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="bg-gray-800 h-[100vh] flex flex-col">
              <div className="flex flex-row items-center">
                <div
                  className="w-full border-[1px] border-gray rounded-xl p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => {
                    setSelectedHistory(0);
                    setEditTopic(false);
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                    setOpenSidebar(false);
                  }}
                >
                  + New Chat
                </div>
                <FaWindowClose
                  className="mx-4 md:mx-0 md:hidden hover:cursor-pointer"
                  size={40}
                  onClick={() => setOpenSidebar(false)}
                />
              </div>
              <div className="min-h-[50%] h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                {loadingHistory ? (
                  <div className="mx-auto my-auto">
                    <TailSpin color="#00BFFF" height={80} width={80} />
                  </div>
                ) : (
                  <>
                    {history.map((e, i) => (
                      <span
                        className={`m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer flex flex-row gap-3 items-center ${
                          selectedHistory === e.historyId ? "bg-gray-600" : ""
                        }`}
                        key={i}
                      >
                        {selectedHistory === e.historyId && editTopic ? (
                          <input
                            type="text"
                            className="w-full m-3 bg-gray-600"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                          />
                        ) : (
                          <>
                            {i == 0 ? (
                              <div
                                onClick={() => {
                                  setSelectedHistory(-1);
                                  setEditTopic(false);
                                  setAfterAsk(false);
                                  setTimeout(
                                    () => setSelectedHistory(e.historyId),
                                    300
                                  );
                                  setOpenSidebar(false);
                                }}
                                className="w-full p-3 rounded-xl break-all"
                              >
                                {isNewHistory ? (
                                  <Typewriter
                                    words={[
                                      e.topic.length > 23
                                        ? e.topic.slice(0, 23) + "..."
                                        : e.topic,
                                    ]}
                                    onLoopDone={() => setIsNewHistory(false)}
                                    typeSpeed={100}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setSelectedHistory(-1);
                                      setEditTopic(false);
                                      setAfterAsk(false);
                                      setTimeout(
                                        () => setSelectedHistory(e.historyId),
                                        300
                                      );
                                      setOpenSidebar(false);
                                    }}
                                  >
                                    {e.topic.length > 23
                                      ? e.topic.slice(0, 23) + "..."
                                      : e.topic}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span
                                onClick={() => {
                                  setSelectedHistory(-1);
                                  setEditTopic(false);
                                  setAfterAsk(false);
                                  setTimeout(
                                    () => setSelectedHistory(e.historyId),
                                    300
                                  );
                                  setOpenSidebar(false);
                                }}
                                className="w-full p-3 rounded-xl break-all"
                              >
                                {e.topic.length > 23
                                  ? e.topic.slice(0, 23) + "..."
                                  : e.topic}
                              </span>
                            )}
                          </>
                        )}
                        {selectedHistory === e.historyId && !editTopic ? (
                          <>
                            <FaPencilAlt
                              onClick={() => {
                                setNewTopic(e.topic);
                                setEditTopic(true);
                              }}
                            />
                            <FaTrashAlt
                              className="ml-auto mr-3"
                              onClick={() => {
                                setIsDeleteAll(false);
                                setDeleteHistoryElement(e);
                                setOpenConfirm(true);
                              }}
                            />
                          </>
                        ) : selectedHistory === e.historyId && editTopic ? (
                          <>
                            <FaWindowClose
                              onClick={() => {
                                setNewTopic("");
                                setEditTopic(false);
                              }}
                            />
                            <FaCheck
                              className="ml-auto mr-3"
                              onClick={(event) => {
                                setLoadingHistory(true);
                                updateHistory(event, e.historyId);
                                setNewTopic("");
                                setEditTopic(false);
                              }}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </span>
                    ))}
                  </>
                )}
              </div>
              <div className="flex flex-col border-t-2">
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={(e) => {
                    setIsDeleteAll(true);
                    setOpenConfirm(true);
                    setEditTopic(false);
                  }}
                >
                  Clear conversation
                </div>
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => {
                    setOpenSetting(true);
                    setOpenSidebar(false);
                    setEditTopic(false);
                  }}
                >
                  Settings
                </div>
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => {
                    setOpenHelp(true);
                    setOpenSidebar(false);
                    setEditTopic(false);
                  }}
                >
                  Get help
                </div>
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => {
                    setAuthenticated(false);
                    if (status === "authenticated") signOut();
                    else setAuthenticated(false);
                    setOpenSidebar(false);
                    setEditTopic(false);
                  }}
                >
                  Log out
                </div>
              </div>
            </div>
          </div>
          <div
            className={`hidden md:block min-w-[12rem] w-1/5 fixed top-0 left-0 z-[9999]`}
          >
            <div className="bg-gray-800 h-[100vh] flex flex-col">
              <div className="flex flex-row items-center">
                <div
                  className="w-full border-[1px] border-gray rounded-xl p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => {
                    setSelectedHistory(0);
                    setEditTopic(false);
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                    setOpenSidebar(false);
                  }}
                >
                  + New Chat
                </div>
              </div>
              <div className="min-h-[50%] h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                {loadingHistory ? (
                  <div className="mx-auto my-auto">
                    <TailSpin color="#00BFFF" height={80} width={80} />
                  </div>
                ) : (
                  <>
                    {history.map((e: History, i) => (
                      <span
                        className={`m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer flex flex-row gap-3 items-center ${
                          selectedHistory === e.historyId ? "bg-gray-600" : ""
                        }`}
                        key={i}
                      >
                        {selectedHistory === e.historyId && editTopic ? (
                          <input
                            type="text"
                            className="w-full m-3 bg-gray-600"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                          />
                        ) : (
                          <>
                            {i == 0 ? (
                              <div
                                onClick={() => {
                                  setSelectedHistory(-1);
                                  setEditTopic(false);
                                  setAfterAsk(false);
                                  setTimeout(
                                    () => setSelectedHistory(e.historyId),
                                    300
                                  );
                                  setOpenSidebar(false);
                                }}
                                className="w-full p-3 rounded-xl break-all"
                              >
                                {isNewHistory ? (
                                  <Typewriter
                                    words={[
                                      e.topic.length > 23
                                        ? e.topic.slice(0, 23) + "..."
                                        : e.topic,
                                    ]}
                                    onLoopDone={() => setIsNewHistory(false)}
                                    typeSpeed={100}
                                  />
                                ) : (
                                  <span
                                    onClick={() => {
                                      setSelectedHistory(-1);
                                      setEditTopic(false);
                                      setAfterAsk(false);
                                      setTimeout(
                                        () => setSelectedHistory(e.historyId),
                                        300
                                      );
                                      setOpenSidebar(false);
                                    }}
                                  >
                                    {e.topic.length > 23
                                      ? e.topic.slice(0, 23) + "..."
                                      : e.topic}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span
                                onClick={() => {
                                  setSelectedHistory(-1);
                                  setEditTopic(false);
                                  setAfterAsk(false);
                                  setTimeout(
                                    () => setSelectedHistory(e.historyId),
                                    300
                                  );
                                  setOpenSidebar(false);
                                }}
                                className="w-full p-3 rounded-xl break-all"
                              >
                                {e.topic.length > 23
                                  ? e.topic.slice(0, 23) + "..."
                                  : e.topic}
                              </span>
                            )}
                          </>
                        )}

                        {selectedHistory === e.historyId && !editTopic ? (
                          <>
                            <FaPencilAlt
                              onClick={() => {
                                setNewTopic(e.topic);
                                setEditTopic(true);
                              }}
                            />
                            <FaTrashAlt
                              className="ml-auto mr-3"
                              onClick={() => {
                                setIsDeleteAll(false);
                                setDeleteHistoryElement(e);
                                setOpenConfirm(true);
                              }}
                            />
                          </>
                        ) : selectedHistory === e.historyId && editTopic ? (
                          <>
                            <FaWindowClose
                              onClick={() => {
                                setNewTopic("");
                                setEditTopic(false);
                              }}
                            />
                            <FaCheck
                              className="ml-auto mr-3"
                              onClick={(event) => {
                                setLoadingHistory(true);
                                updateHistory(event, e.historyId);
                                setNewTopic("");
                                setEditTopic(false);
                              }}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </span>
                    ))}
                  </>
                )}
              </div>
              <div className="flex flex-col border-t-2">
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={(e) => {
                    setIsDeleteAll(true);
                    setOpenConfirm(true);
                    setEditTopic(false);
                  }}
                >
                  Clear conversation
                </div>
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => {
                    setOpenSetting(true);
                    setOpenSidebar(false);
                    setEditTopic(false);
                  }}
                >
                  Settings
                </div>
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => {
                    setOpenHelp(true);
                    setOpenSidebar(false);
                    setEditTopic(false);
                  }}
                >
                  Get help
                </div>
                <div
                  className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                  onClick={() => {
                    setAuthenticated(false);
                    if (status === "authenticated") signOut();
                    else setAuthenticated(false);
                    setOpenSidebar(false);
                    setEditTopic(false);
                  }}
                >
                  Log out
                </div>
              </div>
            </div>
          </div>
          <div className="md:ml-[20%] md:w-4/5 relative bg-gray-600 min-h-[100vh]">
            {selectedHistory == -1 ? (
              <div className="min-h-[100vh] bg-gray-700 flex">
                <FidgetSpinner
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper mx-auto my-auto"
                  ballColors={["rgb(3 7 18)", "rgb(3 7 18)", "rgb(3 7 18)"]}
                  backgroundColor="rgb(17 24 39)"
                />
              </div>
            ) : selectedHistory == 0 ? (
              <div className="flex flex-col gap-10 md:px-10">
                <h2 className="text-white text-5xl mx-auto font-semibold pt-24">
                  Athena
                </h2>
                <div className="flex flex-col md:flex-row gap-8 mx-auto text-center">
                  <div className="flex flex-col gap-4 text-xl w-full">
                    <h3>Examples</h3>
                    <div className="flex flex-col gap-2 md:gap-4 px-4">
                      <div
                        className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl hover:bg-gray-900 hover:cursor-pointer"
                        onClick={(e) => {
                          setQuestion("Apa ibukota negara Indonesia?");
                        }}
                      >
                        {"Apa ibukota negara Indonesia?"}
                      </div>
                      <div
                        className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl hover:bg-gray-900 hover:cursor-pointer"
                        onClick={(e) => {
                          setQuestion("9 + 10?");
                        }}
                      >
                        {"9 + 10?"}
                      </div>
                      <div
                        className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl hover:bg-gray-900 hover:cursor-pointer"
                        onClick={(e) => {
                          setQuestion(
                            "Apa mata kuliah IF semester 4 yang paling seru?"
                          );
                        }}
                      >
                        {"Apa mata kuliah IF semester 4 yang paling seru?"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 text-xl w-full">
                    <h3 className="text-center">Capabilities</h3>
                    <div className="flex flex-col gap-2 md:gap-4 px-4">
                      <div className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl">
                        {
                          "Melakukan operasi kalkulator dan menentukan hari dari tanggal"
                        }
                      </div>
                      <div className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl">
                        {
                          "Menjawab pertanyaan secara umum sesuai pertanyaan yang terdaftar"
                        }
                      </div>
                      <div className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl">
                        {"Mendaftarkan pertanyaan dan jawaban baru dari Anda"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 text-xl w-full">
                    <h3 className="text-center">Limitations</h3>
                    <div className="flex flex-col gap-2 md:gap-4 px-4">
                      <div className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl">
                        {"Kosakata yang digunakan terbatas"}
                      </div>
                      <div className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl">
                        {"Pertanyaan yang bisa dijawab masih sangat terbatas"}
                      </div>
                      <div className="bg-gray-800 text-sm lg:text-lg mx-auto p-4 rounded-xl">
                        {
                          "Pertanyaan harus sesuai dengan yang disimpan di database"
                        }
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
                        .filter((el) => el.historyId === selectedHistory)
                        .map((e, i) => (
                          <div key={i}>
                            <div className="py-8 px-4 sm:p-8 md:px-20 lg:px-24 xl:px-48 flex flex-row gap-4 sm:gap-8">
                              <div className="flex-shrink-0">
                                <Image
                                  src={data?.user?.image || User}
                                  alt={data?.user?.name || "user"}
                                  width={40}
                                  height={30}
                                />
                              </div>
                              <pre className="whitespace-pre-wrap break-all">
                                {e.userMessage}
                              </pre>
                            </div>
                            <div className="py-8 px-4 sm:p-8 md:px-20 lg:px-24 xl:px-48 flex flex-row gap-4 sm:gap-8 bg-gray-600">
                              <div className="flex-shrink-0">
                                <Image
                                  src={Bot}
                                  alt="bot"
                                  width={40}
                                  height={30}
                                />
                              </div>
                              {afterAsk && i == message.length - 1 ? (
                                <pre className="whitespace-pre-wrap break-all">
                                  <Typewriter
                                    words={[e.botMessage]}
                                    cursorBlinking={false}
                                    typeSpeed={30}
                                    onType={() => {
                                      if (
                                        Math.ceil(
                                          window.innerHeight + window.scrollY
                                        ) +
                                          50 >
                                          document.body.scrollHeight &&
                                        message.length > 1
                                      ) {
                                        scrollToBottom();
                                      }
                                    }}
                                  />
                                </pre>
                              ) : (
                                <pre className="whitespace-pre-wrap break-all">
                                  {e.botMessage}
                                </pre>
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
            <div className="fixed bottom-2 md:bottom-4 w-full md:w-4/5">
              <form
                className="px-4 md:px-0 md:w-2/3 mx-auto relative"
                onSubmit={(e) => {
                  if (!loading) {
                    setLoading(true);
                    submitQuestion(e);
                  }
                }}
              >
                <textarea
                  className="w-full bg-gray-800 p-4 rounded-xl scrollbar-thin scrollbar-thumb-gray-700"
                  style={{ resize: "none" }}
                  placeholder="Send a message"
                  onKeyDown={handleKeyDown}
                  value={question}
                  disabled={loading}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                  }}
                />
                {loading ? (
                  <div className="absolute bottom-4 right-8 md:right-4">
                    <ThreeDots color="white" width={20} height={20} />
                  </div>
                ) : (
                  <FaTelegramPlane
                    className="absolute bottom-4 right-8 md:right-4 cursor-pointer"
                    onClick={(e) => {
                      if (!loading) {
                        setLoading(true);
                        submitQuestion(e);
                      }
                    }}
                    size={20}
                  />
                )}
              </form>
            </div>
          </div>
          {openSetting ? (
            <Setting
              setAlgorithm={setAlgorithm}
              setOpenSetting={setOpenSetting}
              algorithm={algorithm}
            />
          ) : openHelp ? (
            <Help setOpenHelp={setOpenHelp} />
          ) : openConfirm ? (
            <ModalConfirm
              isDeleteAll={isDeleteAll}
              history={deleteHistoryElement}
              setOpenConfirm={setOpenConfirm}
              deleteHistories={deleteHistories}
              deleteHistory={deleteHistory}
              setOpenSidebar={setOpenSidebar}
              setLoadingHistory={setLoadingHistory}
            />
          ) : (
            <></>
          )}
        </div>
        <div
          className={`fixed bottom-28 right-5 rounded-[50%] border-2 p-2 opacity-50 bg-gray-800 hover:cursor-pointer ${
            isAtBottom ? "hidden" : ""
          }`}
          onClick={() => scrollToBottom()}
        >
          <FaArrowDown />
        </div>
      </main>
      {openSetting || openHelp || openConfirm ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[9999]"
          onClick={() => {
            setOpenSetting(false);
            setOpenHelp(false);
            setOpenConfirm(false);
          }}
        ></div>
      ) : openSidebar ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[999]"
          onClick={() => setOpenSidebar(false)}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Athena;
