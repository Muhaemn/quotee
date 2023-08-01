import { signOut } from "firebase/auth";
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

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

export default function DropDown({ id, quotes }) {
  const wrapperRef = useRef(null);
  const [anime, setAnime] = useOutsideAlerter(wrapperRef);
  async function handleDelete() {
    await deleteDoc(doc(db, "quotes", id))
      .then(async () => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          quotes: quotes.filter((e) => e != id),
        }).catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
  return (
    <div ref={wrapperRef} className="text-quotee-600">
      <li
        onClick={() => setAnime((prev) => !prev)}
        className="relative list-none flex items-center gap-2"
      >
        <div
          className={
            " bg-quotee-50 max-h-[300px] border w-[155px] border-quotee-200 text-base rounded-md no-scrollbar  flex-col items-stretch absolute z-50 left-[-140px] top-8 " +
            (anime ? "flex" : "hidden")
          }
        >
          <div className="font-semibold flex flex-col overflow-hidden">
            <p className="text-center border-b p-2 select-none border-quotee-200">
              Quote Setting
            </p>
            <Link
              className="hover:bg-quotee-100 text-sm p-2"
              to={"/create/" + id}
            >
              Edit quote
            </Link>
            <button
              className="hover:bg-red-500 text-left font-semibold hover:text-quotee-50 text-red-500 rounded-b-md text-sm p-2"
              onClick={handleDelete}
            >
              Delete quote
            </button>
          </div>
        </div>
      </li>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 self-end cursor-pointer"
        onClick={() => setAnime((prev) => !prev)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
        />
      </svg>
    </div>
  );
}
