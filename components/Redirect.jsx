import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function Redirect() {
  const location = useLocation();
  return (
    <Navigate
      to={"/quotee/" + location.state.username}
      state={location.state.id}
      replace={true}
    />
  );
}
