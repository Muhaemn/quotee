import React from "react";
import { useNavigate } from "react-router-dom";

export default function Modal({ name, title, description, onClick }) {
  const [showModal, setShowModal] = React.useState(false);
  const navigate = useNavigate();
  return (
    <>
      <button
        className="hover:bg-red-500 text-left font-semibold hover:text-quotee-50 text-red-500 text-sm p-2"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {name}
      </button>
      {showModal ? (
        <>
          <div className="justify-center text-quotee-600 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-quotee-50 outline-none focus:outline-none">
                <div className=" p-3 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-center">
                    {title}
                  </h3>
                </div>

                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-quotee-600 text-lg leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="flex items-stretch justify-around gap-2 p-3 border-t border-solid border-quotee-100 rounded-b">
                  <button
                    className="px-4 w-1/2 text-center py-2  bg-quotee-500 hover:bg-quotee-600 font-semibold rounded text-quotee-50 transition-all ease-in-out duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancle
                  </button>
                  <button
                    className="text-white w-1/2 px-4 text-center py-2 bg-red-500 hover:bg-red-700 rounded  transition-all ease-in-out duration-150"
                    type="button"
                    onClick={async () => {
                      await onClick();
                      navigate("/login");
                    }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
