import React, { useState, useEffect, Suspense } from "react";
import Quote from "../components/Quote";
import {
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  redirect,
  useLoaderData,
  useLocation,
  Await,
  defer,
  useNavigate,
} from "react-router-dom";
import pfp from "../assets/pfp.png";
import FollowDropDown from "../components/FollowDropDown";
import { requireAuth } from "../util";
import ProfileSkeleton from "../skeleton/ProfileSkeleton";

const userId = requireAuth();
export async function loader({ params }) {
  const q = query(collection(db, "users"), where("username", "==", params.id));
  async function getTwoData() {
    let details = "";
    await getDocs(q)
      .then((result) => {
        result.forEach((e) => {
          details = e.data();
          details.id = e.id;
        });
      })
      .catch((err) => console.log(err));

    const quotesData = [];
    const qq = query(
      collection(db, "quotes"),
      where("quotee", "==", details.id),
      orderBy("createdAt", "desc")
    );
    await getDocs(qq)
      .then((d) => {
        d.forEach((e) => {
          let data = e.data();
          data.id = e.id;
          quotesData.push(data);
        });
      })
      .catch((err) => console.log(err));
    return { details, quotesData };
  }
  return defer({ twoData: getTwoData() });
}

export default function AccountDetail() {
  const { twoData } = useLoaderData();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({});
  const [quotesData, setQuotesData] = useState([]);
  const id = useLocation();

  function AccountDataAwait() {
    const quotes = quotesData.map((e, i) => (
      <Quote
        key={i}
        name={profileData.name}
        username={profileData.username}
        photoURL={profileData.photoURL}
        quote={e.quote}
        quotee={e.quoteBy}
        time={e.createdAt}
      />
    ));
    return (
      <div className="flex text-quotee-600 flex-col gap-5 w-full mt-5  px-5 py-2 sm:px-10 sm:py-5 md:px-20 md:py-10">
        <div className="flex justify-between mb-5 rounded-md">
          <h2 className="font-bold text-lg">{profileData.name}</h2>
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
                title="folllowers"
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

        <button
          onClick={handleFollow}
          className="text-white px-4 text-center py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
        >
          {profileData.followers.includes(auth.currentUser.uid)
            ? "Following"
            : "Follow"}
        </button>
        <div className="border-b-2 border-quotee-100"></div>
        <div>
          {quotes.length != 0 ? (
            quotes
          ) : (
            <h1 className="p-10 text-center">No quotes yet</h1>
          )}
        </div>
      </div>
    );
  }
  const q = query(
    collection(db, "quotes"),
    where("quotee", "==", id.state),
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
    if (userId == id.state) {
      console.log("test");
      navigate("/quotee/profile");
    }
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
    const unsub = onSnapshot(doc(db, "users", id.state), (doc) => {
      setProfileData(doc.data());
    });
    return () => {
      unsub();
    };
  }, profileEffect());

  async function handleFollow() {
    await getDoc(doc(db, "users", auth.currentUser.uid)).then(
      async (meData) => {
        meData = meData.data();
        let following = meData.following;
        if (following.includes(id.state)) {
          following = following.filter((e) => e != id.state);
        } else following.push(id.state);
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          following,
        }).catch((err) => console.log(err));
        let followers = profileData.followers;
        if (followers.includes(auth.currentUser.uid)) {
          followers = followers.filter((e) => e != auth.currentUser.uid);
        } else followers.push(auth.currentUser.uid);
        await updateDoc(doc(db, "users", id.state), {
          followers: followers,
        }).catch((err) => console.log(err));
      }
    );
  }
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Await resolve={twoData}>{AccountDataAwait}</Await>
    </Suspense>
  );
}
