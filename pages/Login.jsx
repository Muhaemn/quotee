import React from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import Input from "../components/Input";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import CryptoJS from "crypto-js";
import CircularJSON from "circular-json";
export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  let stats = true;
  await signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const userId = userCredential.user.uid;
      const key = userId.substring(0, 10);
      const encrypted = CryptoJS.AES.encrypt(userId, key);
      localStorage.setItem("currentUser", key);
      localStorage.setItem("userData", CircularJSON.stringify(encrypted));
    })
    .catch((error) => {
      stats = false;
    });
  if (stats) {
    return redirect("/quotee");
  } else {
    return "Incorrect email or password try again";
  }
}
export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  return (
    <div className="flex justify-around flex-col md:flex-row gap-5   items-center h-screen bg-quotee-100 p-10 text-quotee-600">
      <h1 className="text-[70px] sm:text-[90px]">Quotee</h1>
      <div className="flex justify-evenly items-center flex-col w-full md:w-1/3 h-screen bg-quotee-50 border-2 border-quotee-200 rounded-2xl md:rounded-none p-5">
        <h1 className="text-3xl">Welcome</h1>
        <Form
          method="post"
          className="flex flex-col justify-between gap-5 w-full "
        >
          {actionData && (
            <p className="text-center text-white bg-red-500 py-2 rounded">
              {actionData}
            </p>
          )}
          <Input
            type="email"
            id="email"
            name="email"
            require={true}
            placeholder="example@gmail.com"
          />
          <Input
            type="password"
            id="password"
            name="password"
            require={true}
            placeholder="Password"
          />
          <div className="flex justify-between items-center">
            <button
              className={
                navigation.state === "submitting"
                  ? "text-white w-[150px] px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150 animate-pulse"
                  : "text-white w-[150px] px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
              }
              type="submit"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "Logging in..." : "Log in"}
            </button>
            <p className="hover:font-semibold underline">
              <Link to="/quotee/recovery">Forgot password</Link>
            </p>
          </div>
        </Form>
        <p className="text-sm">
          don't have an account ?{" "}
          <span className="underline font-semibold">
            <Link to="/quotee/signup">Create account</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
