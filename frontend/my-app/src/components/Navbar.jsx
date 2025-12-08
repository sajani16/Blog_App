import React from "react";
import { Outlet } from "react-router-dom";

function Navbar() {
  return (
    <div>
      Navbar
      <Outlet />
    </div>
  );
}

export default Navbar;
