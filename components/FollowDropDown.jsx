import React, { useEffect } from "react";
import Account from "./Account";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Modal({
  title,
  data,
  message,
  setProfileData,
  setQuotesData,
}) {
  const [showModal, setShowModal] = React.useState(false);
  const [finalData, setFinalData] = React.useState([]);
  useEffect(() => {
    async function getData() {
      const dataTosSet = [];
      for (let i = 0; i < data.length; i++) {
        await getDoc(doc(db, "users", data[i]))
          .then((d) => {
            dataTosSet.push(d.data());
          })
          .catch((err) => console.log(err));
      }
      setFinalData(dataTosSet);
    }
    getData();
  }, [data.length, data]);

  const dataToShow = finalData.map((e, i) => {
    return (
      <Account
        name={e.name}
        username={e.username}
        photoURL={e.photoURL}
        key={e.username}
        id={data[i]}
        setProfileData={setProfileData}
        setQuotesData={setQuotesData}
      />
    );
  });
  return (
    <div>
      <div
        onClick={() => setShowModal(true)}
        className="flex cursor-pointer items-center flex-col"
      >
        <h2 className="font-bold">{data.length}</h2>
        <h2>{title}</h2>
      </div>
      {showModal ? (
        <>
          <div className="justify-center z-50 text-quotee-600 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none">
            <div className="relative w-10/12   my-6 mx-auto max-w-3xl">
              <div
                onClick={() => setShowModal(false)}
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-quotee-50 outline-none focus:outline-none"
              >
                <div className=" p-3 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl sm:text-2xl font-semibold text-center">
                    {title}
                  </h3>
                </div>

                <div className="relative max-h-[350px] no-scrollbar gap-2 overflow-scroll p-2 flex flex-col">
                  {dataToShow.length != 0 ? (
                    dataToShow
                  ) : (
                    <h1 className="p-10 text-center">{message}</h1>
                  )}
                </div>

                <div className="flex  justify-center p-2 border-t border-solid border-quotee-100 rounded-b">
                  <button
                    className="px-4 w-full  text-center py-2  bg-quotee-500 hover:bg-quotee-600 font-normal rounded text-quotee-50 transition-all ease-in-out duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
