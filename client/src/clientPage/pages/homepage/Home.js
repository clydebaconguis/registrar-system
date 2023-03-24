import React from "react";
import Requests from "../Requests/Requests";
import TOR from "../../components/pagesCopy/TOR";
import HD from "../../components/pagesCopy/HD";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Stats from "../stats/Stats";
import "./home.css";
function Home() {
  const isDisabled = true;
  const goToCfrdRequest = () => {
    window.location.href = "/request/cfrd";
  };

  const goToHdRequest = () => {
    window.location.href = "/request/hd";
  };

  return (
    <div className="homepage-main-container">
      <>
        <div className="home-page-stats">
          <Stats />
        </div>
        <div className="homepage-top">
          <div className="home-carousel">
            <div className="carousel-option">
              <TOR className="home-request-form"  />
              <div
                className="btn-container"
                style={{ pointerEvents: isDisabled ? "auto" : "none" }}
              >
                <button className="carousel-btn" onClick={goToCfrdRequest}>
                  SELECT
                </button>
              </div>
            </div>
          </div>
          <div className="home-carousel">
            <div className="carousel-option">
              <HD className="home-request-form" />
              <div
                className="btn-container"
                style={{ pointerEvents: isDisabled ? "auto" : "none" }}
              >
                <button className="carousel-btn" onClick={goToHdRequest}>
                  SELECT
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
      <div className="homepage-bottom">
        <Requests />
      </div>
    </div>
  );
}

export default Home;
