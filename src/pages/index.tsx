import Image from "next/image";
import { QnA, DummyData } from "@/data/Data";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import Bot from "../public/img/bot.png";
import { FormEvent, Ref, useEffect, useRef, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Setting from "@/components/Setting";
import Help from "@/components/Help";

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
  const [algorithm, setAlgorithm] = useState("KMP");
  const [qna, setQna] = useState<QnA[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedHistory, setSelectedHistory] = useState(0);
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [message, setMessage] = useState<Message[]>([]);
  const [afterAsk, setAfterAsk] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  // Algorithm Example

  function similarity(s1: string, s2: string) {
    var result;

    if (s1.length == 0 || s2.length == 0) {
      result = 1.0;
    } else if (s1.length > s2.length) {
      result = (s1.length - editDistance(s1, s2)) / Number(s1.length);
    } else {
      result = (s2.length - editDistance(s1, s2)) / Number(s2.length);
    }

    return result;
  }

  function editDistance(s1: string, s2: string) {
    var string1 = s1.toLowerCase();
    var string2 = s2.toLowerCase();
    const matrix = [];

    //init first column
    for (let i = 0; i <= string2.length; i++) {
      matrix[i] = [i];
    }

    //init first row
    for (let j = 0; j <= string1.length; j++) {
      matrix[0][j] = j;
    }

    //fill the rest of matrix from 3 matrix above left
    for (let i = 1; i <= string2.length; i++) {
      for (let j = 1; j <= string1.length; j++) {
        if (string2.charAt(i - 1) == string1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] =
            Math.min(
              matrix[i - 1][j - 1],
              Math.min(matrix[i][j - 1], matrix[i - 1][j])
            ) + 1;
        }
      }
    }

    return matrix[string2.length][string1.length];
  }

  function KMPAlgorithm(pattern: string, text: string) {
    var patternFix = pattern.toLowerCase();
    var textFix = text.toLowerCase();
    var patternLength = patternFix.length;
    var textLength = textFix.length;
    var patternLPS = lpsArray(patternFix);
    var flag = false;

    var i = 0;
    var j = -1;

    while (i < textLength && !flag) {
      if (patternFix.charAt(j + 1) == textFix.charAt(i)) {
        if (i + 1 == textLength) {
          flag = true;
        }
        j++;
        i++;
      } else {
        if (j == -1) {
          i++;
        } else {
          j = patternLPS[j + 1] - 1;
        }
      }
    }
    return flag;
  }

  function lpsArray(pattern: string) {
    var patternLength = pattern.length;
    var flag = false;
    var backTo = 0;
    const patternChar = [];
    const lpsArray = [];

    for (let i = 0; i < patternLength; i++) {
      patternChar[i] = pattern.charAt(i);
    }

    for (let j = 0; j <= patternLength; j++) {
      if (j == 0) {
        lpsArray[j] = -1;
        flag = false;
        backTo = 0;
      } else if (j == 1) {
        lpsArray[j] = 0;
        flag = false;
        backTo = 0;
      } else {
        for (let k = 0; k < j - 1; k++) {
          if (patternChar[j - 1] == patternChar[k]) {
            flag = true;
            backTo++;
            lpsArray[j] = backTo;
            break;
          } else {
            flag = false;
            lpsArray[j] = 0;
          }
        }
        if (!flag) {
          backTo = 0;
        }
      }
    }

    return lpsArray;
  }

  const isCalculator = (s: string) => {
    const regexCalculator: RegExp = /^[()\d+\-*/\s]+(\?)?$/;
    if (regexCalculator.test(s)) {
      return true;
    } else {
      return false;
    }
  };

  function isDate(s: string) {
    const inputCleaned = s.replace(/\?/g, "");
    const inputArr = inputCleaned.split(" ");
    const dateString = inputArr[inputArr.length - 1];
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    let match = dateString.match(dateRegex);
    var flag;
    var inputDate = 0;

    if (
      !match ||
      isNaN(Date.parse(match[3] + "-" + match[2] + "-" + match[1]))
    ) {
      flag = false;
    } else {
      flag = true;
      inputDate = Date.parse(match[3] + "-" + match[2] + "-" + match[1]);
    }

    return { flag, inputDate };
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Submit form when Enter key is pressed and Shift key is not held down
      submitQuestion(e);
    }
  };

  const submitQuestion = (e: FormEvent) => {
    e.preventDefault();
    var percentageArray = [];
    var idx = 0;
    if (question === "") {
      // Do nothing
    } else {
      setAfterAsk(true);
      let answer: string = "";
      var resultDate = isDate(question);
      if (resultDate.flag) {
        var theDate = new Date(resultDate.inputDate);
        var days = [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ];
        var result = days[theDate.getDay()];
        answer = "Hari " + result;
      } else if (isCalculator(question)) {
        let expression = question;
        try {
          if (expression[expression.length - 1] === "?") {
            expression = expression.slice(0, -1);
          }
          answer = "Hasilnya adalah " + eval(expression).toString();
        } catch (e) {
          answer = "Sintaks persamaan tidak sesuai.";
        }
      } else {
        let found = false;
        for (let el of qna) {
          if (!found) {
            found = KMPAlgorithm(
              question.toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          }
          if (found) {
            answer = el.answer;
            break;
          }
        }
        if (!found) {
          let percentage: number = 0.0;
          for (let el of qna) {
            let temp = similarity(
              question.toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
            var percentages = temp;
            var percantageQuestion = el.question;
            var percentageArrayData = { percentages, percantageQuestion };
            percentageArray[idx] = percentageArrayData;
            idx++;
            if (temp > percentage) {
              percentage = temp;
              if (percentage >= 0.9) {
                answer = el.answer;
              }
            }
          }
          if (percentage < 0.9) {
            answer +=
              "Pertanyaan tidak ditemukan di database.\nApakah maksud Anda:\n";
            percentageArray.sort((a, b) => b.percentages - a.percentages);
            if (qna.length < 3) {
              for (let i = 0; i < qna.length; i++) {
                if (i != qna.length - 1) {
                  answer +=
                    (i + 1).toString() +
                    ". " +
                    percentageArray[i].percantageQuestion +
                    "\n";
                } else {
                  answer +=
                    (i + 1).toString() +
                    ". " +
                    percentageArray[i].percantageQuestion;
                }
              }
            } else {
              for (let i = 0; i < 3; i++) {
                if (i != 2) {
                  answer +=
                    (i + 1).toString() +
                    ". " +
                    percentageArray[i].percantageQuestion +
                    "\n";
                } else {
                  answer +=
                    (i + 1).toString() +
                    ". " +
                    percentageArray[i].percantageQuestion;
                }
              }
            }
          }
        }
      }
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
          bot_message: answer,
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
          bot_message: answer,
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

  useEffect(() => {
    setQna(DummyData);
  }, []);

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
                        setTimeout(() => setSelectedHistory(e.id), 300);
                      }}
                    >
                      {e.name}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col border-t-2">
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => {
                      setHistory([]);
                      setMessage([]);
                    }}
                  >
                    Clear conversation
                  </div>
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => setOpenSetting(true)}
                  >
                    Settings
                  </div>
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => setOpenHelp(true)}
                  >
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
                        <div
                          className="bg-gray-800 text-lg mx-auto p-4 rounded-xl hover:bg-gray-900 hover:cursor-pointer"
                          onClick={(e) => {
                            setQuestion("Apa ibukota negara Indonesia?");
                          }}
                        >
                          {"Apa ibukota negara Indonesia?"}
                        </div>
                        <div
                          className="bg-gray-800 text-lg mx-auto p-4 rounded-xl hover:bg-gray-900 hover:cursor-pointer"
                          onClick={(e) => {
                            setQuestion("9 + 10?");
                          }}
                        >
                          {"9 + 10?"}
                        </div>
                        <div
                          className="bg-gray-800 text-lg mx-auto p-4 rounded-xl hover:bg-gray-900 hover:cursor-pointer"
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
                                <pre className="whitespace-pre-wrap">
                                  {e.user_message}
                                </pre>
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
                                  <pre className="whitespace-pre-wrap">
                                    <Typewriter
                                      words={[e.bot_message]}
                                      cursorBlinking={false}
                                      typeSpeed={40}
                                      onType={() => {
                                        if (
                                          Math.ceil(
                                            window.innerHeight + window.scrollY
                                          ) +
                                            50 >
                                          document.body.scrollHeight
                                        ) {
                                          scrollToBottom();
                                        } else {
                                          console.log(
                                            Math.ceil(
                                              window.innerHeight +
                                                window.scrollY
                                            ),
                                            document.body.scrollHeight
                                          );
                                        }
                                      }}
                                    />
                                  </pre>
                                ) : (
                                  <pre className="whitespace-pre-wrap">
                                    {e.bot_message}
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
            {openSetting ? (
              <Setting
                setAlgorithm={setAlgorithm}
                setOpenSetting={setOpenSetting}
                algorithm={algorithm}
              />
            ) : openHelp ? (
              <Help setOpenHelp={setOpenHelp} />
            ) : (
              <></>
            )}
          </div>
        </main>
        {openSetting || openHelp ? (
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50"></div>
        ) : (
          <></>
        )}
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
