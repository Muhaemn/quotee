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
      <div className=" flex flex-col gap-2 items-center">
        <h1 className="text-[60px] sm:text-[90px]">Quotee</h1>
        <h4 className=" text-center">
          Where Words Connect. Share and Discover Inspirational Quotes!
        </h4>
        <div className=" flex flex-col justify-center items-center rounded-t-md w-full p-3 gap-2">
          <code className="text-sm">Developed by Muhaemn</code>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/_muhaemn/"
              target="_blanck"
              title="Instagram"
              alt="instagram"
              className=" rounded-full bg-quotee-600 w-9 flex items-center justify-center h-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                className="bi bi-instagram"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
                  fill="#f7f7f7"
                ></path>{" "}
              </svg>
            </a>

            <a
              href="https://github.com/Muhaemn"
              target="_blanck"
              title="Github"
              alt="Github"
              className=" rounded-full bg-quotee-600 w-9 flex items-center justify-center h-9"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-brand-github"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#f7f7f7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />{" "}
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />{" "}
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-evenly items-center flex-col w-full md:w-1/3 h-[600px] sm:h-screen bg-quotee-50 border-2 border-quotee-200 rounded-2xl md:rounded-none p-5">
        <h1 className="text-3xl">Welcome</h1>
        <Form
          method="post"
          className="flex flex-col justify-around gap-5 w-full "
        >
          {actionData && (
            <p className="text-center text-white bg-red-500 py-2 rounded">
              {actionData}
            </p>
          )}
          <div className="flex justify-between flex-col  gap-2">
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
          </div>
          <div className="flex justify-between flex-col  gap-5 items-center">
            <button
              className={
                navigation.state === "submitting"
                  ? "text-white w-full px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150 animate-pulse"
                  : "text-white w-full px-4 py-2 disabled:bg-quotee-600 disabled:cursor-not-allowed rounded bg-quotee-500 hover:bg-quotee-600 transition-all ease-in-out duration-150"
              }
              type="submit"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "Logging in..." : "Log in"}
            </button>
          </div>
        </Form>
        <div className=" flex flex-col justify-between sm:flex-row items-center gap-2 text-sm">
          <p className="hover:font-bold font-semibold underline">
            <Link to="/quotee/recovery">Forgot password</Link>
          </p>
          or
          <p className="hover:font-bold font-semibold underline">
            <Link to="/quotee/signup">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
