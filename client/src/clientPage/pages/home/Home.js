import React from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../images/logo.png";
import Main from "../images/main.svg";
import "./home.css";

export default function Home() {
  const navigate = useNavigate();

  const changePath = () => {
    navigate("/login");
  };

  return (
    <div className="home-main-container">
      <div className="home-first-container">
        <div className="home-logo-container">
          <img className="home-logo" src={Logo} />
        </div>
        <div className="home-container">
          <div className="home-first-container">
            <div className="home-second-container">
              <div className="home-title-container">
                <div className="home-title">
                  <h1>Online</h1>
                  <h1 className="home-texts" style={{ color: "#d6c41c" }}>
                    Document
                  </h1>
                  <h1 className="home-texts">Request</h1>
                </div>
                <div className="home-description">
                  <p>
                    Built purse maids cease her ham new seven among and. Pulled
                    coming wooded tended it answer remain me be. So landlord by
                    we unlocked sensible it. Fat cannot use denied excuse son
                    law. Wisdom happen suffer common the appear ham beauty her
                    had. Or belonging zealously existence as by resources.
                  </p>
                </div>
                <div className="home-btn-container">
                  <button className="home-btn" onClick={changePath}>
                    Login/Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="home-first-container">
        <div className="home-second-container">
          <div className="home-image-container">
            <img className="home-image" src={Main} />
          </div>
        </div>
      </div>
    </div>
  );
}
