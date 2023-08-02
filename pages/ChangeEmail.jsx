import React from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import Input from "../components/Input";
import { db, auth } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export async function action({ request }) {
  const formData = await request.formData();
  const newEmail = formData.get("newEmail");
  const pass = formData.get("pass");
  let state = true;
  let message = "";

  const credential = EmailAuthProvider.credential(auth.currentUser.email, pass);
  await reauthenticateWithCredential(auth.currentUser, credential)
    .then(async () => {
      await updateEmail(auth.currentUser, newEmail)
        .then(async () => {
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            email: newEmail,
          });
        })
        .catch((error) => {
          console.log(error);
          state = false;
          message = "Email is already in use";
        });
    })
    .catch((error) => {
      console.log(error);
      state = false;
      message = "Incorrect password";
    });

  if (!state) {
    return {
      message,
      succeed: false,
    };
  }
  return redirect("/quotee/profile");
}

export default function ChangeEmail() {
  const actionData = useActionData();
  const navigation = useNavigation();
  return (
    <div className="w-full text-quotee-600 flex flex-col justify-evenly h-[90vh] items-center px-5 py-2 sm:px-10 sm:py-5 md:px-20 md:py-10">
      <h1 className="text-3xl font-semibold">Change Email</h1>
      <Form method="post" className="w-full flex flex-col gap-5 justify-center">
        {!actionData?.succeed && actionData !== undefined && (
          <p className="text-center text-white bg-red-500 py-2 rounded">
            {actionData?.message}
          </p>
        )}
        <label className="flex flex-col gap-2" htmlFor="newEmail">
          <span className="text-md font-semibold">New Email</span>
          <Input
            id="newEmail"
            name="newEmail"
            require={true}
            type="email"
            placeholder="newemail@example.com"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="pass">
          <span className="text-md font-semibold">
            Enter password to pursuit
          </span>
          <Input
            id="pass"
            name="pass"
            require={true}
            type="password"
            min={6}
            placeholder="Password"
          />
        </label>
        <button
          className={
            navigation.state === "submitting"
              ? "text-white px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150 animate-pulse"
              : "text-white px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
          }
          type="submit"
          disabled={navigation.state === "submitting"}
        >
          {navigation.state === "submitting" ? "Changing" : "Change"}
        </button>
      </Form>
    </div>
  );
}
