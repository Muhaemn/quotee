import React, { useState } from "react";
import Account from "../components/Account";
import { collection } from "firebase/firestore";
import debounce from "lodash.debounce";
import { db } from "../firebase";
import { getDocs } from "firebase/firestore";

export default function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [pending, setPending] = useState(false);

  const debouncedSearch = debounce(handleSearch, 500);
  const handleInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearch(newSearchTerm);
    debouncedSearch(newSearchTerm.toLowerCase());
  };
  async function handleSearch(searchQuery) {
    setPending(true);
    await getDocs(collection(db, "users"))
      .then((data) => {
        const final = [];
        data.forEach((d) => {
          const user = d.data();
          user.id = d.id;
          const username = user.username;
          const name = user.name.toLowerCase();
          if (searchQuery) {
            if (
              username.substring(0, searchQuery.length) == searchQuery ||
              name.substring(0, searchQuery.length) == searchQuery
            ) {
              final.push(user);
            }
          }
        });
        if (final.length == 0) {
          setPending(false);
        }
        setResults(final);
      })
      .catch((error) => console.log(error));
  }
  const searchResult = results.map((e) => {
    return (
      <Account
        key={e.uid}
        name={e.name}
        username={e.username}
        photoURL={e.photoURL}
        id={e.id}
        setProfileData={() => {}}
        setQuotesData={() => {}}
      />
    );
  });

  return (
    <div className="w-full text-quotee-600 gap-5 flex-col flex mt-5 justify-center items-center px-5 py-2 sm:px-10 sm:py-5 md:px-20 md:py-10">
      <div className="flex gap-2 w-full justify-center items-center ">
        <input
          className=" focus:outline-quotee-200 w-full px-5 py-2 rounded  bg-quotee-100 placeholder:text-quotee-300"
          id="search"
          name="search"
          value={search}
          onChange={handleInputChange}
          placeholder="Search"
          type="text"
          autoComplete="off"
        />
        <button
          onClick={() => {
            handleSearch(search);
          }}
          className="text-white px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
      <div key={2003} className="w-full flex flex-col gap-2">
        {searchResult.length != 0 ? (
          searchResult
        ) : search && !pending ? (
          <div
            key={1}
            className="font-semibold text-center flex items-center justify-center text-lg h-[600px]"
          >
            No users found
          </div>
        ) : !pending ? (
          <div
            key={2}
            className="font-semibold text-center flex items-center justify-center text-lg h-[600px]"
          >
            Results will show up here
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
