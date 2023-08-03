import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import { auth, db, storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  or,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

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

export default function DeleteAccount({ username }) {
  const warpperRef = useRef(null);
  const [showModal, setShowModal] = useOutsideAlerter(warpperRef);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  function handleChange(e) {
    setPassword(e.target.value);
  }
  async function handleDelete(e) {
    e.preventDefault();
    setIsDeleting(true);
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );

    await reauthenticateWithCredential(auth.currentUser, credential)
      .then(async () => {
        setIsDeleting(false);
        const user = auth.currentUser;
        await getDocs(
          query(
            collection(db, "users"),
            or(
              where("following", "array-contains", auth.currentUser.uid),
              where("followers", "array-contains", auth.currentUser.uid)
            )
          )
        ).then(async (data) => {
          data.forEach(async (d) => {
            const followData = d.data();
            followData.id = d.id;
            console.log("inside");
            await updateDoc(doc(db, "users", followData.id), {
              followers: followData.followers.filter(
                (e) => e != auth.currentUser.uid
              ),
              following: followData.following.filter(
                (e) => e != auth.currentUser.uid
              ),
            }).catch((err) => console.log(err));
          });
        });
        await getDocs(
          query(
            collection(db, "quotes"),
            where("quotee", "==", auth.currentUser.uid)
          )
        ).then(async (data) => {
          data.forEach(async (d) => {
            await deleteDoc(doc(db, "quotes", d.id)).catch((err) =>
              console.log(err)
            );
          });
        });
        await deleteDoc(doc(db, "users", user.uid))
          .then(() => {
            console.log("document deleted");
          })
          .catch((error) => console.log(error));

        const storageRef = ref(
          storage,
          "gs://fir-3c5fd.appspot.com/" + username
        );
        await deleteObject(storageRef)
          .then(() => {
            console.log("file deleted");
          })
          .catch((error) => {
            console.log(error);
          });
        await deleteUser(auth.currentUser)
          .then(() => {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("userData");
            navigate("/login");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
      })
      .finally(() => setIsDeleting(false));
  }
  return (
    <>
      <button
        className="hover:bg-red-500 text-left font-semibold hover:text-quotee-50 text-red-500 rounded-b-md text-sm p-2"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Delete Account
      </button>
      {showModal ? (
        <>
          <div className="justify-center backdrop-blur text-quotee-600 items-center flex overflow-x-hidden p-3 overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div
                ref={warpperRef}
                className="border-0 max-w-[500px] px-5 rounded-lg shadow-lg relative flex flex-col  bg-quotee-50 outline-none focus:outline-none"
              >
                <div className=" p-3 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-center">
                    Delete Account
                  </h3>
                </div>
                {isError && (
                  <p className="text-center mt-3  text-quotee-50 bg-red-500 py-2 rounded">
                    Incorrect password
                  </p>
                )}
                <div className="relative py-3 flex-auto">
                  <p className=" text-quotee-600 text-lg leading-relaxed">
                    Are you sure you want to delete your account and all the
                    personal data with it ? This action cannot be undone
                  </p>
                </div>
                <form onSubmit={handleDelete}>
                  <label className="flex flex-col gap-2" htmlFor="pass">
                    <span className="text-md font-semibold">
                      Enter password to pursuit
                    </span>
                    <Input
                      onChange={handleChange}
                      id="pass"
                      name="pass"
                      require={true}
                      value={password}
                      type="password"
                      placeholder="password"
                    />
                  </label>
                  <div className="flex items-stretch mt-4 justify-around gap-2 py-3 border-t border-solid border-quotee-100 rounded-b">
                    <button
                      className="px-4 w-1/2 text-center py-2  bg-quotee-500 hover:bg-quotee-600  font-semibold rounded text-quotee-50 transition-all ease-in-out duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Cancle
                    </button>
                    <button
                      className={
                        isDeleting
                          ? "text-quotee-50 w-1/2 px-4 text-center py-2 rounded bg-red-500  hover:bg-red-700  transition-all ease-in-out duration-150 animate-pulse"
                          : "text-quotee-50 w-1/2 px-4 text-center py-2 rounded bg-red-500  hover:bg-red-700  transition-all ease-in-out duration-150"
                      }
                      type="submit"
                    >
                      {isDeleting
                        ? "Deleting account ..."
                        : "Delete my account"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
