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
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export async function action({ request }) {
  const formData = await request.formData();
  const oldPass = formData.get("oldPass");
  const newPass = formData.get("newPass");
  const reNewPass = formData.get("reNewPass");
  let state = true;
  let message = "faild";
  if (newPass !== reNewPass) {
    return {
      message: "Password did not match",
      succeed: false,
    };
  }
  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    oldPass
  );
  await reauthenticateWithCredential(auth.currentUser, credential)
    .then(async () => {
      await updatePassword(auth.currentUser, newPass)
        .then(async () => {
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            password: newPass,
          });
        })
        .catch((error) => {
          console.log(error);
          state = false;
        });
    })
    .catch((error) => {
      console.log(error);
      state = false;
      message = "Incorrect old password";
    });

  if (!state) {
    return {
      message,
      succeed: false,
    };
  }
  return redirect("/quotee/profile");
}

export default function ChangePassword() {
  const actionData = useActionData();
  const navigation = useNavigation();
  return (
    <div className="w-full flex text-quotee-600 flex-col justify-evenly h-[90vh] items-center px-5 py-2 sm:px-10 sm:py-5 md:px-20 md:py-10">
      <h1 className="text-3xl font-semibold">Change Password</h1>
      <Form method="post" className="w-full flex flex-col gap-5 justify-center">
        {!actionData?.succeed && actionData !== undefined && (
          <p className="text-center text-white bg-red-500 py-2 rounded">
            {actionData?.message}
          </p>
        )}
        <label className="flex flex-col gap-2" htmlFor="oldPass">
          <span className="text-md font-semibold">Old password</span>
          <Input
            id="oldPass"
            name="oldPass"
            require={true}
            type="password"
            placeholder="Old password"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="newPass">
          <span className="text-md font-semibold">New password</span>
          <Input
            id="newPass"
            name="newPass"
            require={true}
            type="password"
            min={6}
            placeholder="New password"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="reNewPass">
          <span className="text-md font-semibold">
            Enter new password again
          </span>
          <Input
            id="reNewPass"
            name="reNewPass"
            min={6}
            require={true}
            type="password"
            placeholder="Enter new password again"
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
        <p className="text-center">
          Can't remember password ?{" "}
          <Link
            className="underline font-semibold transition-all ease-in-out duration-150"
            to="/recovery"
          >
            Forgot password
          </Link>
        </p>
      </Form>
    </div>
  );
}
