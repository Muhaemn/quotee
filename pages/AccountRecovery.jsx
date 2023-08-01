import React from "react";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import Input from "../components/Input";
import { db, auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  let state = true;
  await sendPasswordResetEmail(auth, email)
    .then(() => {})
    .catch((error) => {
      state = false;
      console.log("error");
    });
  if (state) {
    return {
      message: "email sent to your account you can reset your password there",
      succeed: true,
    };
  } else {
    return { message: "no accounts found with this email", succeed: false };
  }
}

export default function AccountRecovery() {
  const actionData = useActionData();
  const navigation = useNavigation();
  console.log(actionData);
  return (
    <div className="flex justify-around flex-col md:flex-row gap-5   items-center h-screen bg-quotee-100 p-10 text-quotee-600">
      <h1 className="text-[100px]">Quotee</h1>
      <div className="flex justify-center gap-10 items-center flex-col w-full md:w-1/3 h-screen bg-quotee-50 border-2 border-quotee-200 rounded p-5">
        <h1 className="text-3xl">Account Recovery</h1>
        <Form
          method="post"
          className="flex flex-col justify-between gap-5 w-full "
        >
          {actionData?.succeed && actionData !== undefined ? (
            <p className="text-center text-white bg-green-500 py-2 rounded">
              {actionData.message}
            </p>
          ) : actionData !== undefined ? (
            <p className="text-center text-white bg-red-500 py-2 rounded">
              {actionData?.message}
            </p>
          ) : (
            ""
          )}
          <Input
            type="email"
            id="email"
            name="email"
            require={true}
            placeholder="example@gmail.com"
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
            {navigation.state === "submitting"
              ? "Sending email ..."
              : "Send email"}
          </button>
        </Form>
      </div>
    </div>
  );
}
