import React from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  Navigate,
  useNavigation,
} from "react-router-dom";
import Input from "../components/Input";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import CryptoJS from "crypto-js";
import CircularJSON from "circular-json";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");
  const username = formData.get("username").toLowerCase();
  const password = formData.get("password");
  const password2 = formData.get("password2");
  let state = true;
  if (password !== password2) {
    return {
      message: "password did not match",
      succeed: false,
    };
  }
  const q = query(collection(db, "users"), where("username", "==", username));
  const data = await getDocs(q);
  if (data.docs.length) {
    return {
      message: "username is alerady taken",
      succeed: false,
    };
  }
  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        username,
        password,
        email,
        bio: "",
        following: [],
        followers: [],
        quotes: [],
      })
        .then(() => console.log("account created"))
        .catch(() => console.log("error"));
      const userId = userCredential.user.uid;
      const key = userId.substring(0, 10);
      const encrypted = CryptoJS.AES.encrypt(userId, key);
      localStorage.setItem("currentUser", key);
      localStorage.setItem("userData", CircularJSON.stringify(encrypted));
    })
    .catch((err) => {
      console.log(err);
      state = false;
    });
  await updateProfile(auth.currentUser, { displayName: name }).catch(() => {
    console.log("error cant update profile");
  });
  if (state) {
    throw redirect("/quotee");
  } else {
    return {
      message: "this email is already in use",
      succeed: false,
    };
  }
}

export default function SignUp() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const state = localStorage.getItem("currentUser");
  if (state) {
    return <Navigate to="/quotee" replace={true} />;
  }
  return (
    <div className="flex justify-around flex-col md:flex-row gap-5   items-center h-screen bg-quotee-100 p-10 text-quotee-600">
      <h1 className="text-[100px]">Quotee</h1>
      <div className="flex justify-evenly items-center flex-col w-full md:w-1/3 h-screen bg-quotee-50 border-2 border-quotee-200 rounded p-5">
        <h1 className="text-3xl">Welcome</h1>
        <Form
          method="post"
          className="flex flex-col justify-between gap-5 w-full "
        >
          {!actionData?.succeed && actionData !== undefined ? (
            <p className="text-center text-white bg-red-500 py-2 rounded">
              {actionData.message}
            </p>
          ) : (
            ""
          )}
          <Input
            type="text"
            id="name"
            name="name"
            require={true}
            placeholder="Name"
          />
          <Input
            type="text"
            id="username"
            pattern="[a-zA-Z0-9_]{3,20}"
            title="username can only contain letters,numbers and ( _ )"
            name="username"
            require={true}
            placeholder="Username"
          />
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
            min={6}
            placeholder="Password"
          />
          <Input
            type="password"
            id="password2"
            name="password2"
            min={6}
            require={true}
            placeholder="Enter password again"
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
              ? "Creating account ..."
              : "Create account"}
          </button>
        </Form>
        <p className="text-sm">
          already have an account ?{" "}
          <span className="underline font-semibold">
            <Link to="/quotee/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
