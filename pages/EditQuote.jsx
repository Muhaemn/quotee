import React, { useState } from "react";
import { Form, redirect, useLoaderData, useNavigation } from "react-router-dom";
import Input from "../components/Input";
import { auth, db } from "../firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { requireAuth } from "../util";
export async function loader({ params }) {
  let currentUser = requireAuth();
  let data;
  await getDoc(doc(db, "quotes", params.id))
    .then((d) => {
      data = d.data();
      data.id = d.id;
    })
    .catch((err) => console.log(err));
  if (data.quotee !== currentUser) {
    throw redirect("/quotee/profile");
  }
  return data;
}
export async function action({ request }) {
  const formData = await request.formData();
  const quote = formData.get("quote");
  const quoteBy = formData.get("quoteBy");
  const id = formData.get("id");
  updateDoc(doc(db, "quotes", id), {
    quote,
    quoteBy,
  }).catch((err) => console.log(err));
  return redirect("/profile");
}

export default function EditQuote() {
  const navigation = useNavigation();
  const quoteData = useLoaderData();
  const [data, setData] = useState({
    quote: quoteData.quote,
    quoteBy: quoteData.quoteBy,
  });
  function handleChange(e) {
    setData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }
  return (
    <div className="w-full text-quotee-600 flex flex-col justify-center items-center py-2 sm:px-10 sm:py-5 md:px-20 md:py-10">
      <h1 className="text-2xl mb-5 font-semibold py-3 text-center border-b sm:border-none border-quotee-200 w-full">
        Edit Quote
      </h1>
      <Form
        method="post"
        className="w-full flex flex-col gap-5 px-5 justify-center"
      >
        <div className="flex flex-col gap-3 w-full">
          <label className="text-lg font-semibold" htmlFor="quote">
            Quote
          </label>
          <textarea
            className="focus:outline-quotee-200 resize-none px-5 w-full py-2 rounded bg-quotee-100 placeholder:text-quotee-300"
            name="quote"
            onChange={handleChange}
            rows="10"
            id="quote"
            value={data.quote}
            required
            placeholder="maybe the moon is beautiful because it is far"
          ></textarea>
          <input
            type="text"
            className="hidden"
            id="id"
            name="id"
            value={quoteData.id}
            onChange={() => {}}
          />
        </div>
        <label className="text-lg font-semibold" htmlFor="quoteBy">
          Quote by
        </label>
        <div className="flex flex-col gap-3 w-full">
          <Input
            id="quoteBy"
            name="quoteBy"
            require={true}
            value={data.quoteBy}
            onChange={handleChange}
            type="text"
            placeholder="Mahmoud Darwish"
          />
          <button
            className={
              navigation.state === "submitting"
                ? "text-white px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150 animate-pulse"
                : "text-white px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
            }
            type="submit"
            disabled={navigation.state === "submitting"}
          >
            {navigation.state === "submitting" ? "Updating ..." : "Update"}
          </button>
        </div>
      </Form>
    </div>
  );
}
