import React, { useRef, useState, useEffect } from "react";
import Test from "./Test";

function useOutsideAlerter(ref) {
  const [anime, setAnime] = useState(false);
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setAnime(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return [anime, setAnime];
}

export default function Modal({ setImg, remove, img, url, setRemove }) {
  const wrapperRef = useRef(null);
  const [showModal, setShowModal] = useOutsideAlerter(wrapperRef);
  return (
    <>
      <button
        className=" self-center text-blue-400 font-semibold cursor-pointer"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {remove
          ? "Set profile picture"
          : img || url
          ? "Update profile picture"
          : "Set profile picture"}
      </button>
      {showModal ? (
        <>
          <div className="justify-center backdrop-blur w-[90%] mx-auto h-full text-quotee-600 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full h-[65%]  mx-auto max-w-3xl">
              <div
                ref={wrapperRef}
                className="border-0 rounded-xl h-full shadow-lg relative flex flex-col w-full bg-quotee-50 outline-none focus:outline-none"
              >
                <Test
                  setShowModal={setShowModal}
                  setImg={setImg}
                  setRemove={setRemove}
                />
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
