import React, { useEffect, useState, Suspense } from "react";
import Quote from "../components/Quote";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link, useLoaderData, Await, defer } from "react-router-dom";
import pfp from "../assets/pfp.png";
import DropDown from "../components/DropDown";
import { requireAuth } from "../util";
import FollowDropDown from "../components/FollowDropDown";
import ProfileSkeleton from "../skeleton/ProfileSkeleton";

export async function loader() {
  const userId = requireAuth();
  async function getData() {
    let data = await getDoc(doc(db, "users", userId));
    data = data.data();
    return data;
  }
  async function getQuotesData() {
    let quotesData = [];

    const q = query(
      collection(db, "quotes"),
      where("quotee", "==", userId),
      orderBy("createdAt", "desc")
    );
    await getDocs(q)
      .then((d) => {
        d.forEach((e) => {
          let data = e.data();
          data.id = e.id;
          quotesData.push(data);
        });
      })
      .catch((err) => console.log(err));
    return quotesData;
  }
  return defer({ profileData1: getData(), quotesData1: getQuotesData() });
}

export default function Profile() {
  const { profileData1, quotesData1 } = useLoaderData();
  const [profileData, setProfileData] = useState({});
  const [quotesData, setQuotesData] = useState([]);
  const userId = requireAuth();
  function profileDataAwait(proData) {
    function quoteDataAwait(quoData) {
      const quotes = quotesData.map((e, i) => {
        return (
          <Quote
            key={i}
            name={proData.name}
            username={proData.username}
            photoURL={proData.photoURL}
            quote={e.quote}
            quotee={e.quoteBy}
            id={e.id}
            profile={true}
            time={e.createdAt}
            quotes={proData.quotes}
            verified={profileData?.verified}
          />
        );
      });
      return (
        <div>
          {quotes.length != 0 ? (
            quotes
          ) : (
            <h1 className="p-10 text-center">No quotes yet</h1>
          )}
        </div>
      );
    }

    return (
      <div className="flex text-quotee-600 flex-col gap-5 w-full mt-5  px-5 py-2 sm:px-10 sm:py-5 md:px-20 md:py-10">
        <div className="flex justify-between mb-5 rounded-md">
          <div className=" flex gap-1 justify-between items-center">
            <h2 className="font-bold text-lg">{profileData.name}</h2>
            {profileData?.verified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
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
          <DropDown username={profileData.username} />
        </div>

        <div className="flex justify-around  flex-col md:flex-row items-center gap-5">
          <div className="flex flex-col  items-center gap-5">
            <div className="w-[110px] h-[110px] sm:w-[125px] sm:h-[125px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden bg-quotee-800">
              <img
                src={profileData.photoURL ? profileData.photoURL : pfp}
                className=" object-cover w-full h-full"
              />
            </div>
            <h3 className="text-md sm:text-lg">{profileData.username}</h3>
          </div>
          <div className=" flex flex-col gap-10">
            <div className="flex justify-between items-center gap-10 text-md sm:text-lg font-semibold">
              <FollowDropDown
                title="followers"
                data={profileData.followers}
                message="No followers yet"
                setProfileData={setProfileData}
                setQuotesData={setQuotesData}
              />
              <FollowDropDown
                title="following"
                data={profileData.following}
                message="Not following anyone yet"
                setProfileData={setProfileData}
                setQuotesData={setQuotesData}
              />
              <div className="flex items-center flex-col">
                <h2 className="font-bold">{profileData.quotes.length}</h2>
                <h2>quotes</h2>
              </div>
            </div>
            <p className=" whitespace-pre-wrap">{profileData.bio}</p>
          </div>
        </div>
        <Link
          className="text-white px-4 text-center py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
          to="edit"
        >
          Edit profile
        </Link>
        <div className="border-b-2 border-quotee-100"></div>
        <Suspense
          fallback={
            <div className="w-full h-[200px] rounded-md animate-pulse bg-quotee-100"></div>
          }
        >
          <Await resolve={quotesData1}>{quoteDataAwait}</Await>
        </Suspense>
      </div>
    );
  }
  const q = query(
    collection(db, "quotes"),
    where("quotee", "==", userId),
    orderBy("createdAt", "desc")
  );
  function profileEffect() {
    if (Object.keys(profileData).length === 0) {
      return ["", "", "", "", "", ""];
    } else {
      return [
        profileData.followers.length,
        profileData.following.length,
        profileData.bio,
        profileData.quotes.length,
        profileData.name,
        profileData.username,
      ];
    }
  }
  function quoteEffect() {
    if (quotesData.length === 0) {
      return [""];
    } else {
      return [quotesData?.length];
    }
  }

  useEffect(() => {
    const unsub = onSnapshot(q, (d) => {
      let qData = [];
      d.forEach((e) => {
        let data = e.data();
        data.id = e.id;
        qData.push(data);
      });
      setQuotesData(qData);
    });
    return () => {
      unsub();
    };
  }, quoteEffect());

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", userId), (doc) => {
      setProfileData(doc.data());
    });
    return () => {
      unsub();
    };
  }, profileEffect());

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Await resolve={profileData1}>{profileDataAwait}</Await>
    </Suspense>
  );
}
