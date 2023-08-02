import React, { useState } from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import {
  getDoc,
  doc,
  query,
  where,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import Input from "../components/Input";
import CropImage from "../components/CropImage";
import pfp from "../assets/pfp.png";
import { storage, db, auth } from "../firebase";
import { updateProfile } from "firebase/auth";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { requireAuth } from "../util";
import imageCompression from "browser-image-compression";

export async function loader() {
  const userId = requireAuth();
  let data = await getDoc(doc(db, "users", userId));
  data = data.data();
  return data;
}
let imgData = {
  type: "application/octet-stream",
};
export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const username = formData.get("username").toLowerCase();
  const usernameOg = formData.get("usernameOg").toLowerCase();
  const bio = formData.get("bio");
  const pfp = imgData;
  const remove = formData.get("remove");
  const compressedFile = await imageCompression(pfp, {
    maxSizeMB: 1,
    maxWidthOrHeight: 640,
  }).catch((err) => console.log(err));
  console.log(pfp);
  if (username !== usernameOg) {
    const q = query(collection(db, "users"), where("username", "==", username));
    const data = await getDocs(q);
    if (data.docs.length) {
      return {
        message: "username is alerady taken",
        succeed: false,
      };
    }
  }
  if (
    username !== usernameOg &&
    pfp.type != "application/octet-stream" &&
    !remove
  ) {
    const storageRef = ref(storage, "gs://fir-3c5fd.appspot.com/" + usernameOg);
    deleteObject(storageRef)
      .then(() => {
        console.log("file deleted");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const storageRef = ref(storage, username);
  if (pfp.type != "application/octet-stream" && !remove) {
    const uploadTask = await uploadBytesResumable(storageRef, compressedFile);
    await getDownloadURL(uploadTask.ref).then(async (downloadURL) => {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        photoURL: downloadURL,
        name,
        bio,
        username,
      });
    });
  } else if (remove) {
    const storageRef = ref(storage, "gs://fir-3c5fd.appspot.com/" + usernameOg);
    deleteObject(storageRef)
      .then(() => {
        console.log("file deleted");
      })
      .catch((error) => {
        console.log(error);
      });
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      photoURL: "",
      name,
      bio,
      username,
    });
  } else {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      name,
      bio,
      username,
    });
  }
  await updateProfile(auth.currentUser, {
    displayName: name,
  });
  throw redirect("/quotee/profile");
}

export default function Edit() {
  const actionData = useActionData();
  const [remove, setRemove] = useState("");
  const navigation = useNavigation();
  const loaderData = useLoaderData();
  const [inputs, setInputs] = useState({
    name: loaderData.name,
    username: loaderData.username,
    bio: loaderData.bio,
  });
  const [img, setImg] = useState({
    show: null,
    row: {
      type: "application/octet-stream",
    },
  });
  imgData = img.row;
  function handleChange(e) {
    setInputs((prev) => {
      let name = e.target.name;
      return { ...prev, [name]: e.target.value };
    });
  }
  return (
    <div className="flex flex-col text-quotee-600 justify-center items-center gap-5 w-full mt-5  px-5 py-2 sm:px-10 sm:py-5 md:px-20 md:py-10">
      <div className="w-[100px] h-[100px] sm:w-[125px] sm:h-[125px] md:w-[150px] md:h-[150px] overflow-hidden rounded-full bg-quotee-800">
        <img
          src={
            remove
              ? pfp
              : img.show
              ? img.show
              : loaderData.photoURL
              ? loaderData.photoURL
              : pfp
          }
          className=" object-cover w-full h-full"
        />
      </div>
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col justify-between gap-3 w-full "
      >
        <div className="flex justify-center gap-1 flex-col">
          <CropImage
            setImg={setImg}
            setRemove={setRemove}
            remove={remove}
            url={loaderData.photoURL}
            img={img.show}
          />
          <label
            onClick={() => setRemove("remove")}
            className={
              "self-center text-red-400 font-semibold cursor-pointer " +
              (remove || (!loaderData.photoURL && !img.show) ? "hidden" : "")
            }
          >
            Remove photo
            <input
              type="text"
              className="hidden"
              id="remove"
              name="remove"
              value={remove}
              onChange={() => {}}
            />
          </label>
        </div>
        {!actionData?.succeed && actionData !== undefined ? (
          <p className="text-center  text-quotee-50 bg-red-500 py-2 rounded">
            {actionData.message}
          </p>
        ) : (
          ""
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            onChange={handleChange}
            placeholder="name"
            value={inputs.name}
            type="text"
            name="name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            pattern="[a-zA-Z0-9_]{3,20}"
            title="username can only contain letters,numbers and ( _ )"
            onChange={handleChange}
            placeholder="username"
            value={inputs.username}
            type="text"
            name="username"
          />
        </div>

        <input
          id="usernameOg"
          value={loaderData.username}
          type="text"
          onChange={() => {}}
          name="usernameOg"
          className="hidden"
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="bio">Your Bio</label>
          <textarea
            className="focus:outline-quotee-200 resize-none px-5 w-full py-2 rounded bg-quotee-100 placeholder:text-quotee-300"
            name="bio"
            onChange={handleChange}
            rows="8"
            id="bio"
            placeholder="bio"
            value={inputs.bio}
          ></textarea>
        </div>
        <div className="flex gap-2 flex-row-reverse">
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
              ? "Saving Cganges ..."
              : "Save Changes"}
          </button>
          <Link
            to={-1}
            className=" text-quotee-50 px-4 py-2  rounded bg-red-500  hover:bg-red-700 transition-all ease-in-out duration-150"
            type="button"
          >
            Discard Changes
          </Link>
        </div>
      </Form>
    </div>
  );
}
