import React from "react";
import pfp from "../assets/pfp.png";
import { Link } from "react-router-dom";
export default function Account({
  photoURL,
  name,
  username,
  id,
  setProfileData,
  setQuotesData,
}) {
  return (
    <div className="w-full border border-quotee-200 rounded-md cursor-pointer hover:bg-quotee-100 transition-all ease-in-out duration-150">
      <Link
        onClick={() => {
          setProfileData({
            name: "",
            username: "",
            password: "",
            email: "",
            bio: "",
            following: [],
            followers: [],
            quotes: [],
          });
          setQuotesData([]);
        }}
        to={"/redirect/"}
        state={{ id, username }}
      >
        <div className="flex px-4 py-2 justify-between items-center gap-5">
          <div className="flex gap-3 items-center">
            <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] rounded-full overflow-hidden bg-quotee-800">
              <img
                src={photoURL ? photoURL : pfp}
                className=" object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-md sm:text-lg font-bold">{name}</h3>
              <h3 className="text-md font-normal">{username}</h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
