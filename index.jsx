import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  redirect,
} from "react-router-dom";
import Login, { action as loginAction } from "./pages/Login";
import AccountRecovery, {
  action as recoveryAction,
} from "./pages/AccountRecovery";
import SignUp, { action as signUpAction } from "./pages/SignUp";
import Home, { loader as homeLoader } from "./pages/Home";
import Layout from "./components/Layout";
import Profile, { loader as profileLoader } from "./pages/Profile";
import Create, { action as createAction } from "./pages/Create";
import Edit, { loader as editLoader, action as editAction } from "./pages/Edit";
import ChangePassword, {
  action as changePasswordAction,
} from "./pages/ChangePassword";
import ChangeEmail, { action as changeEmailAction } from "./pages/ChangeEmail";
import { requireAuth } from "./util";
import Search from "./pages/Search";
import AccountDetail, {
  loader as accountDetailLoader,
} from "./pages/AccountDetail";
import EditQuote, {
  loader as editQuoteLoader,
  action as editQuoteAction,
} from "./pages/EditQuote";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/quotee" element={<Layout />}>
        <Route index loader={homeLoader} element={<Home />} />
        <Route path="profile" loader={profileLoader} element={<Profile />} />
        <Route
          path="create"
          action={createAction}
          loader={() => requireAuth()}
          element={<Create />}
        />
        <Route
          path="create/:id"
          action={editQuoteAction}
          loader={editQuoteLoader}
          element={<EditQuote />}
        />
        <Route
          path=":id"
          action={createAction}
          loader={accountDetailLoader}
          element={<AccountDetail />}
        />
        <Route
          path="search"
          action={createAction}
          loader={() => requireAuth()}
          element={<Search />}
        />
        <Route
          path="profile/edit"
          action={editAction}
          loader={editLoader}
          element={<Edit />}
        />
        <Route
          path="profile/edit/password"
          action={changePasswordAction}
          loader={() => requireAuth()}
          element={<ChangePassword />}
        />
        <Route
          path="profile/edit/email"
          loader={() => requireAuth()}
          action={changeEmailAction}
          element={<ChangeEmail />}
        />
      </Route>
      <Route
        path="recovery"
        action={recoveryAction}
        element={<AccountRecovery />}
      />
      <Route path="signup" action={signUpAction} element={<SignUp />} />
      <Route path="login" action={loginAction} element={<Login />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
