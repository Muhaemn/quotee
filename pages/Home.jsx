import React, { useState, useEffect } from "react";
import Quote from "../components/Quote";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useLoaderData } from "react-router-dom";
import { requireAuth } from "../util";
import { db } from "../firebase";
export async function loader() {
  requireAuth();
  const finalData = [];
  const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
  const quotes = await getDocs(q).catch((err) => console.log(err));
  quotes.forEach(async (quote) => {
    const quoteData = quote.data();
    await getDoc(doc(db, "users", quoteData.quotee))
      .then((quotee) => {
        const quoteeData = quotee.data();
        quoteData.id = quotee.id;
        finalData.push({ ...quoteData, ...quoteeData });
      })
      .catch((err) => console.log(err));
  });
  return finalData;
}
export default function Home() {
  const quotesData = useLoaderData();
  const [test, setTest] = useState(false);
  useEffect(() => {
    setTest((prev) => !prev);
  }, quotesData);
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
      />
    );
  });
  return (
    <div className="w-full py-2 sm:py-5  md:py-10 text-quotee-600  flex flex-col">
      <h1
        onClick={() => setTest((prev) => !prev)}
        className="text-2xl mb-5 font-semibold py-3 text-center border-b sm:border-none border-quotee-200 w-full"
      >
        Home
      </h1>
      <div className="w-full px-5  sm:px-10 md:px-20  text-quotee-600  flex flex-col">
        {quotes}
      </div>
    </div>
  );
}
