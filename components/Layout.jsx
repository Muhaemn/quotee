import React from "react";
import { NavLink, Outlet } from "react-router-dom";
export default function Layout() {
  function scrollTop() {
    window.scrollTo({ top: 0 });
  }
  return (
    <div className="flex flex-col-reverse justify-between  sm:flex-row text-quotee-600 min-h-screen">
      <div className="h-[50px] z-40 sm:h-screen sticky bg-quotee-100 flex text-lg font-semibold sm:flex-col left-0 bottom-0 sm:top-0 sm:border-r-2 border-t-2 justify-evenly items-center border-quotee-200  min-w-[90px] md:min-w-[250px]">
        <NavLink
          onClick={scrollTop}
          to=""
          className=" select-none font-semibold text-3xl hidden md:block"
        >
          Quotee
        </NavLink>
        <NavLink
          onClick={scrollTop}
          to=""
          end
          className={({ isActive, isPending }) =>
            isPending
              ? "flex bg-quotee-200 animate-pulse px-5 py-3 rounded-md justify-center items-center gap-3"
              : isActive
              ? "flex sm:bg-quotee-200 px-5 py-3 rounded-md justify-center items-center gap-3"
              : "flex  px-5 py-3 rounded-md justify-center items-center gap-3"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className=" w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <p className="hidden md:block">Home</p>
        </NavLink>
        <NavLink
          onClick={scrollTop}
          to="search"
          className={({ isActive, isPending }) =>
            isPending
              ? "flex bg-quotee-200 animate-pulse px-5 py-3 rounded-md justify-center items-center gap-3"
              : isActive
              ? "flex sm:bg-quotee-200 px-5 py-3 rounded-md justify-center items-center gap-3"
              : "flex  px-5 py-3 rounded-md justify-center items-center gap-3"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>

          <p className="hidden md:block">Search</p>
        </NavLink>
        <NavLink
          onClick={scrollTop}
          to="create"
          className={({ isActive, isPending }) =>
            isPending
              ? "flex bg-quotee-200 animate-pulse px-5 py-3 rounded-md justify-center items-center gap-3"
              : isActive
              ? "flex sm:bg-quotee-200 px-5 py-3 rounded-md justify-center items-center gap-3"
              : "flex  px-5 py-3 rounded-md justify-center items-center gap-3"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <p className="hidden md:block">Create</p>
        </NavLink>
        <NavLink
          onClick={scrollTop}
          to="profile"
          className={({ isActive, isPending }) =>
            isPending
              ? "flex bg-quotee-200 animate-pulse px-5 py-3 rounded-md justify-center items-center gap-3"
              : isActive
              ? "flex sm:bg-quotee-200 px-5 py-3 rounded-md justify-center items-center gap-3"
              : "flex  px-5 py-3 rounded-md justify-center items-center gap-3"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <p className="hidden md:block">Profile</p>
        </NavLink>
      </div>
      <div className="flex flex-col items-center w-full">
        <Outlet />
      </div>
    </div>
  );
}
