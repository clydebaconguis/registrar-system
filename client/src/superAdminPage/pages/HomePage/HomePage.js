import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
function HomePage() {
  return (
    <div className="admin-home-container">
      <Sidebar />

      <div className="admin-home-wrapper">
        <Navbar />
      </div>
      <div>asdasd</div>
    </div>
  );
}

export default HomePage;
