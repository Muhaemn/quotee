import React from "react";
export default function ProfileSkeleton() {
  return (
    <div className="flex text-quotee-600 flex-col gap-5 w-full mt-5  px-5 py-2 sm:px-10 sm:py-5 md:px-20 md:py-10">
      <div className="flex justify-between mb-5 rounded-md">
        <h2 className="font-bold text-lg animate-pulse bg-quotee-100 rounded-md w-full h-[25px]"></h2>
      </div>
      <svg
        className="animate-spin h-5 w-5 mr-3 color"
        viewBox="0 0 24 24"
      ></svg>

      <div className="flex justify-around  flex-col md:flex-row items-center gap-5">
        <div className="flex flex-col  items-center gap-5">
          <div className="w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] md:w-[150px] md:h-[150px] animate-pulse rounded-full overflow-hidden bg-quotee-100"></div>
          <h2 className="font-bold text-lg animate-pulse bg-quotee-100 rounded-md w-[100px] h-[20px]"></h2>
        </div>
        <div className=" flex flex-col gap-5">
          <div className="flex justify-between items-center gap-10 text-md sm:text-lg font-semibold">
            <div className="flex items-center flex-col">
              <h2 className="font-bold text-lg animate-pulse bg-quotee-100 rounded-md w-[100px] h-[20px]"></h2>
            </div>
            <div className="flex items-center flex-col">
              <h2 className="font-bold text-lg animate-pulse bg-quotee-100 rounded-md w-[100px] h-[20px]"></h2>
            </div>
            <div className="flex items-center flex-col">
              <h2 className="font-bold text-lg animate-pulse bg-quotee-100 rounded-md w-[100px] h-[20px]"></h2>
            </div>
          </div>
          <div className="flex flex-col gap-2 whitespace-pre-wrap">
            <p className="font-bold text-lg animate-pulse bg-quotee-100 rounded-md w-[90%] h-[15px]"></p>
            <p className="font-bold text-lg animate-pulse bg-quotee-100 rounded-md w-[30%] h-[15px]"></p>
            <p className="font-bold text-lg animate-pulse bg-quotee-100 rounded-md w-[50%] h-[15px]"></p>
          </div>
        </div>
      </div>

      <div className="text-white px-4 text-center animate-pulse h-10 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-100  transition-all ease-in-out duration-150"></div>
      <div className="border-b-2 border-quotee-100"></div>
      <div className="w-full h-[200px] rounded-md animate-pulse bg-quotee-100"></div>
    </div>
  );
}
