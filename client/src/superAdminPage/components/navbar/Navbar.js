import React from "react";
import { HiDocumentSearch } from "react-icons/hi";

function Navbar() {
  return (
    <div className="admin-navbar-container">
      <div className="admin-navbar-wrapper">
        <div className="admin-navbar-search">
          <HiDocumentSearch className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search Reference Number..."
            className="admin-navbar-input"
          />
          <button className="admin-navbar-btn">Search</button>
        </div>
        <div className="admin-navbar-items">
          <HiDocumentSearch />
          <HiDocumentSearch />
          <HiDocumentSearch />
          <HiDocumentSearch />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
