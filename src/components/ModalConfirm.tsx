import { Dispatch, SetStateAction, FormEvent } from "react";

const ModalConfirm = ({
  historyId,
  isDeleteAll,
  deleteHistory,
  deleteHistories,
  setOpenConfirm,
  setOpenSidebar,
}: {
  historyId: number;
  isDeleteAll: boolean;
  setOpenConfirm: Dispatch<SetStateAction<boolean>>;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
  deleteHistory: (e: FormEvent, historyId: number) => Promise<void>;
  deleteHistories: (e: FormEvent) => Promise<void>;
}) => {
  return (
    <>
      <div className="fixed z-[99999] bg-gray-400 rounded-2xl shadow-xl p-6 text-black w-3/4 md:w-[24rem] flex flex-col gap-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col border-2 p-4 border-black rounded-xl gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-center mx-auto">
            Are you sure want to delete{" "}
            {isDeleteAll ? "all of your histories" : `history ${historyId}`}?
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 mx-auto">
            <button
              onClick={() => setOpenConfirm(false)}
              className="border-2 max-w-[6rem] p-2 mx-auto border-black"
            >
              Cancel
            </button>
            <button
              className="border-2 max-w-[6rem] p-2 mx-auto border-black"
              onClick={(e) => {
                if (isDeleteAll) deleteHistories(e);
                else deleteHistory(e, historyId);
                setOpenConfirm(false);
                setOpenSidebar(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalConfirm;
