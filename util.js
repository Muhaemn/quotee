import CryptoJS from "crypto-js";
import CircularJSON from "circular-json";
import { redirect } from "react-router-dom";
export function requireAuth() {
  const currentUser = localStorage.getItem("currentUser");
  const userData = CircularJSON.parse(localStorage.getItem("userData"));
  if (!currentUser || !userData) {
    return redirect("/login");
  }
  const decrypted = CryptoJS.AES.decrypt(userData, currentUser);
  const userId = decrypted.toString(CryptoJS.enc.Utf8);
  return userId;
}
export function isLoggedIn() {
  const currentUser = localStorage.getItem("currentUser");
  const userData = CircularJSON.parse(localStorage.getItem("userData"));
  if (currentUser && userData) {
    throw redirect("/quotee");
  }
}
