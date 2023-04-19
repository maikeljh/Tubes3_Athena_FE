import { Dispatch, SetStateAction } from "react";
import Close from "../public/img/close.png";
import Image from "next/image";

const Help = ({
  setOpenHelp,
}: {
  setOpenHelp: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="fixed z-[99999] bg-gray-400 rounded-2xl shadow-xl p-6 text-black w-1/2 flex flex-col gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row items-center relative">
          <h1 className="text-2xl font-bold text-center mx-auto">Help</h1>
          <Image
            src={Close}
            alt="close"
            width={40}
            className="ml-auto absolute right-0 top-0"
            onClick={() => setOpenHelp(false)}
          />
        </div>
        <div className="flex flex-col gap-4 mx-auto text-xl font-semibold">
          <p>1. Type a question in the message box to ask questions.</p>
          <p>
            2. Login to another account by pressing the log out button if you
            want to check another {"account's"} history.
          </p>
          <p>
            3. Press the clear conversation button to clear all of your history.
          </p>
          <p>
            4. Press the settings button to change the algorithm of the string
            matching.
          </p>
          <p>5. Press the new chat button to make a new chat tab/history</p>
        </div>
      </div>
    </>
  );
};

export default Help;
