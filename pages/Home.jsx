import React, { useState, useEffect, Suspense } from "react";
import Quote from "../components/Quote";
import {
  collection,
  doc,
  getDoc,
  orderBy,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import QuoteSkeleton from "../skeleton/QuoteSkeleton";

export default function Home() {
  const [quotesData, setQuotesData] = useState([]);
  const [show, setShow] = useState(true);
  function HomeDataAwait() {
    if (quotesData == "no data") {
      return (
        <div className="w-full pb-2 sm:pb-5  md:pb-10 text-quotee-600 h-[700px]  flex flex-col">
          <div className="flex w-full text-md sm:text-lg mb-5 justify-bettwen items-start">
            <h1
              onClick={() => setShow(false)}
              className={
                !show
                  ? "border-quotee-100 cursor-pointer py-3 text-center border-b-[3px] font-semibold w-1/2"
                  : "border-quotee-100 cursor-pointer py-3 text-center w-1/2 "
              }
            >
              Following
            </h1>
            <h1
              onClick={() => setShow(true)}
              className={
                show
                  ? "border-quotee-100 cursor-pointer py-3 text-center border-b-[3px] font-semibold w-1/2"
                  : "border-quotee-100 cursor-pointer py-3 text-center w-1/2 "
              }
            >
              All
            </h1>
          </div>
          <div className="w-full px-5 text-lg   sm:px-10 md:px-20  text-quotee-600  flex justify-center items-center h-[60%]">
            There is no quotes yet
          </div>
        </div>
      );
    }
    if (!quotesData.length) {
      return <QuoteSkeleton />;
    }
    const quotes = quotesData.map((e) => {
      return (
        <Quote
          key={e.createdAt}
          name={e.name}
          username={e.username}
          photoURL={e.photoURL}
          quote={e.quote}
          quotee={e.quoteBy}
          time={e.createdAt}
          id={e.id}
          verified={e?.verified}
        />
      );
    });
    return (
      <div className="w-full pb-2 sm:pb-5  md:pb-10 text-quotee-600  flex flex-col">
        <div className="flex w-full text-md sm:text-lg md:text-xl mb-5 justify-bettwen items-start">
          <h1
            onClick={() => setShow(false)}
            className={
              !show
                ? "border-quotee-100 cursor-pointer font-semibold py-3 text-center border-b-[3px] w-1/2"
                : "border-quotee-100 cursor-pointer py-3 text-center w-1/2 "
            }
          >
            Following
          </h1>
          <h1
            onClick={() => setShow(true)}
            className={
              show
                ? "border-quotee-100 cursor-pointer font-semibold py-3 text-center border-b-[3px] w-1/2"
                : "border-quotee-100 cursor-pointer py-3 text-center w-1/2 "
            }
          >
            All
          </h1>
        </div>
        <div className="w-full px-5 sm:px-10 md:px-20 text-quotee-600 flex flex-col">
          {quotes}
        </div>
      </div>
    );
  }

  const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
  useEffect(() => {
    const unsub = onSnapshot(q, (snapshot) => {
      const quoteesData = [];
      const quotees = [];
      const quotesData = [];
      snapshot.forEach((quote) => {
        const temp = quote.data();
        quotees.push(temp.quotee);
        quotesData.push(temp);
      });

      Promise.all(
        quotees.map(async (e, i) => {
          try {
            const quotee = await getDoc(doc(db, "users", e));
            const quoteeData = quotee.data();
            quoteeData.id = quotee.id;
            if (
              quoteeData.followers.includes(auth.currentUser.uid) ||
              quotee.id == auth.currentUser.uid ||
              show
            ) {
              quoteesData.push({ ...quoteeData, ...quotesData[i] });
            }
          } catch (err) {
            console.log(err);
          }
        })
      ).then(() => {
        if (!quoteesData.length) {
          setQuotesData("no data");
        } else {
          setQuotesData(quoteesData);
        }
      });
    });

    return () => {
      unsub();
    };
  }, [show]);

  return <HomeDataAwait />;
}
