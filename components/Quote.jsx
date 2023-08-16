import React from "react";
import pfp from "../assets/pfp.png";
import { Link } from "react-router-dom";
import QuoteDropDown from "./QuoteDropDown";
import moment from "moment/moment";
export default function Quote({
  name,
  username,
  quote,
  quotee,
  photoURL,
  id,
  profile,
  time,
  quotes,
  verified,
}) {
  const date = moment(time.toDate()).fromNow();
  function scrollTop() {
    window.scrollTo({ top: 0 });
  }
  return (
    <div className="felx border-b  flex-col-reverse">
      <div className="p-5 flex items-center justify-center flex-col sm:flex-row gap-2 text-quotee-600">
        <Link onClick={scrollTop} to={"/quotee/" + username} state={id}>
          <div className="flex  items-center gap-3 sm:w-[160px] md:w-[200px]">
            <div className="min-w-[50px] min-h-[50px] sm:min-w-[60px] sm:min-h-[60px] md:min-w-[70px] md:min-h-[70px] max-w-[50px] max-h-[50px] sm:max-w-[60px] sm:max-h-[60px] md:max-w-[70px] md:max-h-[70px] rounded-full overflow-hidden bg-quotee-800">
              <img
                src={photoURL ? photoURL : pfp}
                className=" object-fill w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <div className=" flex gap-1 justify-between items-center">
                <h2 className="font-bold">{name}</h2>
                {verified && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="16"
                    height="16"
                    viewBox="0 0 48 48"
                  >
                    <circle cx="25" cy="25" r="20" fill="#4dd0e1"></circle>
                    <path
                      fill="#fff"
                      d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659l-6.083-6.084c-0.879-0.878-0.879-2.303,0-3.182 c0.878-0.879,2.304-0.879,3.182,0l6.083,6.084c0.879,0.878,0.879,2.303,0,3.182C23.643,30.47,23.067,30.69,22.491,30.69z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659c-0.879-0.878-0.879-2.303,0-3.182l9.539-9.539 c0.878-0.879,2.304-0.879,3.182,0c0.879,0.878,0.879,2.303,0,3.182l-9.539,9.539C23.643,30.47,23.067,30.69,22.491,30.69z"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
          </div>
        </Link>
        <div className=" relative w-full bg-quotee-100 rounded-md pr-5 pt-5 pl-5 pb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2.5em"
            className=" absolute top-[-20px] left-5"
            viewBox="0 0 448 512"
            fill="#4d4d4d"
          >
            <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z" />
          </svg>
          {profile && (
            <div className=" absolute top-2 right-2">
              <QuoteDropDown id={id} quotes={quotes} />
            </div>
          )}
          <p className="font-semibold text-center whitespace-pre-wrap">
            {quote}
          </p>
          <div className="italic text-xs mt-5">{quotee}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2.5em"
            className=" absolute bottom-[-20px] right-5"
            viewBox="0 0 448 512"
            fill="#4d4d4d"
          >
            <path d="M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z" />
          </svg>
        </div>
      </div>
      <div className="italic text-right text-xs px-5 pb-2">{date}</div>
    </div>
  );
}
