import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { AuthProvider } from "./Components/Routes/AuthContext";
import PrivateRoute from "./Components/Routes/PrivateRoute";
import StaticData from "./Utils/StaticText.json";
import Dashboard from "./Components/Dashboard";
import "./StyleSheets/Dashboard.css";
import "./StyleSheets/DashboardMenu.css";

const Home = lazy(() => import("./Components/Home"));
const About = lazy(() => import("./Components/About"));
const Contact = lazy(() => import("./Components/Contact"));
const Feature = lazy(() => import("./Components/Feature"));
const Login = lazy(() => import("./Components/Login"));
const SignUp = lazy(() => import("./Components/SignUp"));

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const HandleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", HandleResize);
    return () => window.removeEventListener("resize", HandleResize);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar StaticData={StaticData} windowWidth={windowWidth} />
        <div style={{ height: "86px" }} />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route exact path="/" element={<Home StaticData={StaticData} />} />
            <Route path="/about" element={<About StaticData={StaticData} />} />
            <Route path="/contact" element={<Contact StaticData={StaticData} />} />
            <Route path="/features" element={<Feature />} />
            <Route path="/login" element={<Login StaticData={StaticData} />} />
            <Route
              path="/signup"
              element={<SignUp StaticData={StaticData} />}
            />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute
                  element={<Dashboard windowWidth={windowWidth} />}
                />
              }
            />
          </Routes>
        </Suspense>
        <Footer StaticData={StaticData} windowWidth={windowWidth} />
      </Router>
    </AuthProvider>
  );
};

export default App;
