import React from "react";
import { Link } from "react-router-dom";
export default function ErrorElement() {
  return (
    <>
      <main className=" bg-quotee-50 flex justify-center items-center h-screen ">
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-quotee-600 sm:text-5xl">
            Something went wrong
          </h1>
          <p className="mt-6 text-base leading-7 text-quotee-400">
            Pleace check your internet connection or refresh the page
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="text-white px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
            >
              Go back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
