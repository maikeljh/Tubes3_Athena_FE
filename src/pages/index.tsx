import Image from "next/image";
import { QnA, DummyData } from "@/data/Data";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import Bot from "../public/img/bot.png";
import { FormEvent, Ref, useEffect, useRef, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Setting from "@/components/Setting";
import Help from "@/components/Help";
import {
  FaArrowDown,
  FaPlus,
  FaBars,
  FaWindowClose,
  FaTelegramPlane,
} from "react-icons/fa";

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
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(false);

  // Algorithm
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

  function BMAlgorithm(pattern: string, text: string) {
    var patternFix = pattern.toLowerCase();
    var textFix = text.toLowerCase();
    var patternLength = patternFix.length;
    var textLength = textFix.length;
    var badMatchTable = badMatch(patternFix);
    var badTableLength = badMatchTable.badTable.length;
    var i = patternLength - 1;
    var j = patternLength - 1;
    var flag = false;
    var found;
    var count = 0;
    var jump;
    var total = 0;

    while (i < textLength && !flag) {
      jump = 0;
      if (patternFix.charAt(j) == textFix.charAt(i)) {
        total++;
        if (total == pattern.length) {
          flag = true;
        }
        j--;
        i--;
        count++;
      } else {
        total = 0;
        found = false;
        for (let k = 0; k < badTableLength; k++) {
          if (badMatchTable.patternChar[k] == textFix.charAt(i)) {
            if (badMatchTable.badTable[k] > jump) {
              jump = badMatchTable.badTable[k];
            }
            found = true;
            break;
          }
        }
        if (!found) {
          if (badMatchTable.badTable[badTableLength - 1] > jump) {
            jump = badMatchTable.badTable[badTableLength - 1];
          }
        }
        i += count;
        i += jump;
      }
    }
    return flag;
  }

  function badMatch(pattern: string) {
    var patternLength = pattern.length;
    var flag;
    var k = 0;
    var patternChar = [];
    var badTable = [];

    for (let i = 0; i < patternLength; i++) {
      flag = false;
      for (let j = 0; j < i; j++) {
        if (pattern.charAt(i) == patternChar[j]) {
          badTable[j] = Math.max(1, patternLength - i - 1);
          flag = true;
          break;
        }
      }
      if (!flag) {
        patternChar[k] = pattern.charAt(i);
        badTable[k] = Math.max(1, patternLength - i - 1);
        k++;
      }
    }
    patternChar[k] = "*";
    badTable[k] = patternLength;

    return { badTable, patternChar };
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

    while (i < textLength && !flag && patternLength == textLength) {
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
    const regexCalculator: RegExp = /^[()\d+\-*/.\s]+(\?)?$/;
    if (regexCalculator.test(s)) {
      return true;
    } else {
      return false;
    }
  };

  function isDate(s: string) {
    const inputCleaned = s.replace(/(?: \?|\?)*/g, "").replace(/\s+$/, "");
    const inputArr = inputCleaned.split(" ");
    const dateString = inputArr[inputArr.length - 1];
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    let match = dateString.match(dateRegex);
    var flag;
    var inputDate = 0;

    if (
      !match ||
      isNaN(Date.parse(match[3] + "-" + match[2] + "-" + match[1]))
    ) {
      flag = false;
    } else {
      const year = parseInt(match[3]);
      const month = parseInt(match[2]);
      const day = parseInt(match[1]);
      const lastDay = new Date(year, month, 0).getDate();

      if (day > lastDay) {
        flag = false;
      } else {
        flag = true;
        inputDate = Date.parse(match[3] + "-" + match[2] + "-" + match[1]);
      }
    }

    return { flag, inputDate };
  }

  const isDelete = (s: string) => {
    const regexDelete: RegExp = /^(Hapus pertanyaan)/;
    if (regexDelete.test(s)) {
      return true;
    } else {
      return false;
    }
  };

  const isAdd = (s: string) => {
    const regexAdd: RegExp = /^Tambahkan pertanyaan .+ dengan jawaban .+$/;
    if (regexAdd.test(s)) {
      return true;
    } else {
      return false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 768) {
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
      } else if (isDelete(question)) {
        let regexQuestion = /^Hapus pertanyaan\s+(.*)$/;
        let deleteQuestion = question.match(regexQuestion) as RegExpMatchArray;
        let found = false;
        for (let el of qna) {
          if (!found) {
            found = KMPAlgorithm(
              deleteQuestion[1].toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          }
          if (found) {
            answer = el.answer;
            break;
          }
        }
        if (found) {
          let index = qna.map((e) => e.question).indexOf(deleteQuestion[1]);
          let temp = [...qna];
          temp.splice(index, 1);
          setQna(temp);
          answer = "Pertanyaan " + deleteQuestion[1] + " telah dihapus";
        } else {
          answer =
            "Tidak ada pertanyaan " + deleteQuestion[1] + " pada database!";
        }
      } else if (isAdd(question)) {
        let regexQuestion = /^Tambahkan pertanyaan (.+) dengan jawaban (.+)$/;
        let addQuestion = question.match(regexQuestion) as RegExpMatchArray;
        let found = false;
        for (let el of qna) {
          if (!found) {
            found = KMPAlgorithm(
              addQuestion[1].toLocaleLowerCase(),
              el.question.toLocaleLowerCase()
            );
          }
          if (found) {
            answer = el.answer;
            break;
          }
        }
        if (found) {
          let index = qna.map((e) => e.question).indexOf(addQuestion[1]);
          let temp = [...qna];
          temp.splice(index, 1);
          temp.push({ question: addQuestion[1], answer: addQuestion[2] });
          setQna(temp);
          answer =
            "Pertanyaan " +
            addQuestion[1] +
            " sudah ada! Jawaban di-update ke " +
            addQuestion[2];
        } else {
          answer =
            "Pertanyaan " + addQuestion[1] + " telah ditambah ke database!";
          let temp = [...qna];
          temp.push({ question: addQuestion[1], answer: addQuestion[2] });
          setQna(temp);
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
    scrollToBottom();
  }, [selectedHistory]);

  // Scroll to the bottom of the chat window
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (status === "loading")
    return (
      <div className="mx-auto bg-gray-800 text-white h-[100vh] text-center">
        <h1 className="text-4xl text-center font-bold pt-40 mx-4">
          Loading... Please Wait
        </h1>
      </div>
    );
  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Athena</title>
        </Head>
        <main className="text-white">
          <nav className="absolute sticky top-0 w-full md:hidden bg-gray-800 flex flex-row p-4 z-[999] items-center">
            <div
              className="flex-none"
              onClick={() => setOpenSidebar(!openSidebar)}
            >
              <FaBars className="mr-auto hover:cursor-pointer" />
            </div>
            <h1 className="text-center flex-1">
              {selectedHistory === 0 || selectedHistory === -1
                ? "New Chat"
                : `${history[selectedHistory - 1].name}`}
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
                  {history.map((e: History, i) => (
                    <span
                      className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                      key={i}
                      onClick={() => {
                        setSelectedHistory(-1);
                        setAfterAsk(false);
                        setTimeout(() => setSelectedHistory(e.id), 300);
                        setOpenSidebar(false);
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
                      setSelectedHistory(0);
                      setOpenSidebar(false);
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    Clear conversation
                  </div>
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => {
                      setOpenSetting(true);
                      setOpenSidebar(false);
                    }}
                  >
                    Settings
                  </div>
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => {
                      setOpenHelp(true);
                      setOpenSidebar(false);
                    }}
                  >
                    Get help
                  </div>
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => {
                      signOut();
                      setOpenSidebar(false);
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
                  {history.map((e: History, i) => (
                    <span
                      className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                      key={i}
                      onClick={() => {
                        setSelectedHistory(-1);
                        setAfterAsk(false);
                        setTimeout(() => setSelectedHistory(e.id), 300);
                        setOpenSidebar(false);
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
                      setSelectedHistory(0);
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                      });
                      setOpenSidebar(false);
                    }}
                  >
                    Clear conversation
                  </div>
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => {
                      setOpenSetting(true);
                      setOpenSidebar(false);
                    }}
                  >
                    Settings
                  </div>
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => {
                      setOpenHelp(true);
                      setOpenSidebar(false);
                    }}
                  >
                    Get help
                  </div>
                  <div
                    className="p-3 m-2 hover:bg-gray-600 rounded-xl hover:cursor-pointer"
                    onClick={() => {
                      signOut();
                      setOpenSidebar(false);
                    }}
                  >
                    Log out
                  </div>
                </div>
              </div>
            </div>
            <div className="md:ml-[20%] md:w-4/5 relative bg-gray-600 min-h-[100vh]">
              {selectedHistory == -1 ? (
                <div className="min-h-[100vh] bg-gray-700"></div>
              ) : selectedHistory == 0 ||
                message.filter((el) => el.history_id === selectedHistory)
                  .length === 0 ? (
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
                          {"Melakukan operasi kalkulator"}
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
                              <div className="py-8 px-4 sm:p-8 md:px-20 lg:px-24 xl:px-48 flex flex-row gap-4 sm:gap-8">
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
                              <div className="py-8 px-4 sm:p-8 md:px-20 lg:px-24 xl:px-48 flex flex-row gap-4 sm:gap-8 bg-gray-600">
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
              <div className="fixed bottom-2 md:bottom-4 w-full md:w-4/5">
                <form
                  className="px-4 md:px-0 md:w-2/3 mx-auto relative"
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
                  <FaTelegramPlane
                    className="absolute bottom-4 right-8 md:right-4"
                    onClick={(e) => submitQuestion(e)}
                    size={20}
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
          <div
            className={`fixed bottom-28 right-5 rounded-[50%] border-2 p-2 opacity-50 bg-gray-800 hover:cursor-pointer ${
              isAtBottom ? "hidden" : ""
            }`}
            onClick={() => scrollToBottom()}
          >
            <FaArrowDown />
          </div>
        </main>
        {openSetting || openHelp || openSidebar ? (
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[999]"></div>
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
