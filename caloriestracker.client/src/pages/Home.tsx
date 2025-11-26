import React, { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import AuthorizeView from "../authorization/AuthorizeView";
import { logoutStart } from "../auth";
import DayliMeals from "../features/meal/components/DailyMeals";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const t =
      localStorage.getItem("ct_theme") ||
      (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme:dark)").matches
        ? "dark"
        : "light");
    document.documentElement.setAttribute(
      "data-theme",
      t === "light" ? "light" : "dark"
    );
  }, []);

  const toggleTheme = () => {
    const cur =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ct_theme", next);
  };

  const handleLogout = () => {
    const theme = localStorage.getItem("ct_theme");
    localStorage.clear();
    if (theme) localStorage.setItem("ct_theme", theme);

    try {
      dispatch(logoutStart());
    } catch (e) {}

    window.location.href = "/login";
  };

  return (
    <AuthorizeView>
      <div className="stage">
        <div className="board board--home">
          <div className="containerbox">
            <div className="form-header">
              <div className="header-left">
                <h3 style={{ marginTop: 0 }}>Home</h3>
              </div>
              <div
                className="header-right"
                style={{ display: "flex", gap: 8, alignItems: "center" }}
              >
                <button
                  className="theme-toggle theme-toggle--fixed"
                  onClick={toggleTheme}
                >
                  Theme
                </button>
                <button
                  className="btn secondary"
                  onClick={handleLogout}
                  style={{ padding: "6px 12px", fontSize: "14px" }}
                >
                  Logout
                </button>
              </div>
            </div>

            <DayliMeals />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
};

export default Home;
