import { Dispatch, SetStateAction } from "react";
import Close from "../public/img/close.png";
import Image from "next/image";

const Setting = ({
  setAlgorithm,
  setOpenSetting,
  algorithm,
}: {
  setAlgorithm: Dispatch<SetStateAction<string>>;
  setOpenSetting: Dispatch<SetStateAction<boolean>>;
  algorithm: string;
}) => {
  return (
    <>
      <div className="fixed z-[99999] bg-gray-400 rounded-2xl shadow-xl p-6 text-black w-1/4 flex flex-col gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row items-center relative">
          <h1 className="text-2xl font-bold text-center mx-auto">Settings</h1>
          <Image
            src={Close}
            alt="close"
            width={40}
            className="ml-auto absolute right-0 top-0"
            onClick={() => setOpenSetting(false)}
          />
        </div>
        <div className="flex flex-row border-2 p-4 border-black rounded-xl">
          <h1 className="text-2xl font-bold ml-auto">Algorithm : </h1>
          <div className="flex flex-col gap-4 mx-auto">
            <div className="flex flex-row gap-2">
              <input
                type="radio"
                id="KMP"
                name="algorithm"
                value="KMP"
                checked={algorithm === "KMP"}
                onChange={(e) => setAlgorithm(e.target.value)}
              />
              <label htmlFor="KMP" className="text-xl font-semibold">
                KMP
              </label>
            </div>
            <div className="flex flex-row gap-2">
              <input
                type="radio"
                id="BM"
                name="algorithm"
                value="BM"
                checked={algorithm === "BM"}
                onChange={(e) => setAlgorithm(e.target.value)}
              />
              <label htmlFor="BM" className="text-xl font-semibold">
                BM
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
