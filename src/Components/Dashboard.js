import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faHeartbeat,
  faNotesMedical,
  faAngleDown,
  faComments,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import "../StyleSheets/Dashboard.css";
import StaticData from "../Static/StaticData.json";

import MenuDashboard from "./MenuDashboard";
import MenuGeneralInfo from "./MenuGeneralInfo";
import MenuDiabetes from "./MenuDiabetes";
import MenuChatbot from "./MenuChatbot";
import MenuAppointment from "./MenuAppointment";

const MenuData = [
  {
    icon: faHome,
    text: StaticData.Dashboard.Dashboard_Menu_Dashboard,
    path: "menuDashboard",
  },
  {
    icon: faInfoCircle,
    text: StaticData.Dashboard.Dashboard_Menu_General_Info,
    path: "general-info",
  },
  {
    icon: faHeartbeat,
    text: StaticData.Dashboard.Dashboard_Menu_Health_Analysis,
    path: "health-analysis",
    submenuItems: [
      {
        icon: faNotesMedical,
        text: StaticData.Dashboard.Dashboard_Menu_Diabetes,
        path: "diabetes-analysis",
      },
    ],
  },
  {
    icon: faComments,
    text: StaticData.Dashboard.Dashboard_Menu_Chatbot,
    path: "chatbot",
  },
  {
    icon: faListCheck,
    text: StaticData.Dashboard.Dashboard_Menu_Appointments,
    path: "appointments",
  },
];

const WebMenuItem = ({ icon, text, isActive, onClick }) => (
  <li>
    <h6
      className={`menu-item ${isActive ? "active text-white" : ""}`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="dashboard-faIcon" size="1x" />
      {text}
    </h6>
  </li>
);

const WebSubMenuItem = ({ icon, text, isActive, onClick }) => (
  <li>
    <h6
      className={`submenu-item ${isActive ? "active text-white" : ""}`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="dashboard-faIcon" size="1x" />
      {text}
    </h6>
  </li>
);

const WebMenuList = ({ ToggleSubMenu, setActiveMenu, activeMenu }) => {
  const navigate = useNavigate();

  const HandleMenuClick = (path) => {
    setActiveMenu(path);
    navigate(path);
  };

  return (
    <ul className="dashboard-menu">
      {MenuData.map((item, index) => (
        <React.Fragment key={index}>
          {item.submenuItems ? (
            <li>
              <h6
                className={`dashboard-menu-header ${
                  activeMenu === item.path ? "active text-white" : ""
                }`}
                onClick={() => ToggleSubMenu(item.path)}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="dashboard-faIcon"
                  size="1x"
                />
                {item.text}{" "}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`arrow-icon ${
                    activeMenu === item.path ? "arrow-icon-active " : ""
                  }`}
                />
              </h6>
              <ul
                className={`dashboard-submenu ${
                  activeMenu === item.path ? "active text-white" : ""
                }`}
              >
                {item.submenuItems.map((subItem, subIndex) => (
                  <WebSubMenuItem
                    key={subIndex}
                    icon={subItem.icon}
                    text={subItem.text}
                    path={`${item.path}/${subItem.path}`}
                    isActive={activeMenu === `${item.path}/${subItem.path}`}
                    onClick={() =>
                      HandleMenuClick(`${item.path}/${subItem.path}`)
                    }
                  />
                ))}
              </ul>
            </li>
          ) : (
            <WebMenuItem
              icon={item.icon}
              text={item.text}
              path={item.path}
              isActive={activeMenu === item.path}
              onClick={() => HandleMenuClick(item.path)}
            />
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

const WebDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("menuDashboard");
  const location = useLocation();

  const ToggleSubMenu = (path) => {
    setActiveMenu(activeMenu === path ? null : path);
  };

  useEffect(() => {
    if (location.pathname === "/dashboard/menuDashboard") {
      setActiveMenu("menuDashboard");
    } else if (location.pathname.startsWith("/dashboard/general-info")) {
      setActiveMenu("general-info");
    } else if (location.pathname.startsWith("/dashboard/health-analysis")) {
      setActiveMenu("health-analysis");
    } else if (location.pathname.startsWith("/dashboard/diabetes-analysis")) {
      setActiveMenu("diabetes-analysis");
    } else if (location.pathname.startsWith("/dashboard/chatbot")) {
      setActiveMenu("chatbot");
    } else if (location.pathname.startsWith("/dashboard/appointments")) {
      setActiveMenu("appointments");
    }
  }, [location.pathname]);

  return (
    <Container fluid>
      <Row>
        <Col className="col-4 dashboard-menu-box">
          <Row className="text-center">
            <h3>{StaticData.Dashboard.Dashboard_Welcome}</h3>
          </Row>
          <Row>
            <WebMenuList
              ToggleSubMenu={ToggleSubMenu}
              setActiveMenu={setActiveMenu}
              activeMenu={activeMenu}
            />
          </Row>
        </Col>
        <Col>
          <Container>
            <Routes>
              <Route path="menuDashboard" element={<MenuDashboard />} />
              <Route path="general-info" element={<MenuGeneralInfo />} />
              <Route path="health-analysis">
                <Route path="diabetes-analysis" element={<MenuDiabetes />} />
              </Route>
              <Route path="chatbot" element={<MenuChatbot />} />
              <Route path="appointments" element={<MenuAppointment />} />
              <Route path="*" element={<Navigate to="menuDashboard" />} />
            </Routes>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

const useStyles = {
  appBar: {
    backgroundColor: "#212529",
    overflowX: "auto",
    alignItems: "center",
    height: 40,
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    minHeight: "auto",
    padding: "0 8px",
  },
  menuButton: {
    color: "gray",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minWidth: "auto",
    padding: "8px 16px",
  },
  menuText: {
    fontSize: "0.5rem",
    color: "gray",
    flex: 1,
    textAlign: "left",
  },
  activeMenuText: {
    fontSize: "0.5rem",
    color: "white",
  },
  container: {
    backgroundColor: "black",
    color: "white",
    height: "100vh",
    padding: 0,
  },
};

const MobileDashboard = () => {
  const classes = useStyles;
  const [activeMenu, setActiveMenu] = useState("menuDashboard");
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuItems, setSubmenuItems] = useState([]);
  const [submenuBasePath, setSubmenuBasePath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const HandleMenuClick = (path) => {
    setActiveMenu(path);
    navigate(path);
  };

  const HandleSubMenuOpen = (event, items, basePath) => {
    setAnchorEl(event.currentTarget);
    setSubmenuItems(items);
    setSubmenuBasePath(basePath);
  };

  const HandleSubMenuClose = () => {
    setAnchorEl(null);
    setSubmenuItems([]);
    setSubmenuBasePath("");
  };

  const HandleSubMenuItemClick = (subPath) => {
    const fullPath = `${submenuBasePath}/${subPath}`;
    HandleMenuClick(fullPath);
    HandleSubMenuClose();
  };

  useEffect(() => {
    if (location.pathname === "/dashboard/menuDashboard") {
      setActiveMenu("menuDashboard");
    } else if (location.pathname.startsWith("/dashboard/general-info")) {
      setActiveMenu("general-info");
    } else if (location.pathname.startsWith("/dashboard/health-analysis")) {
      setActiveMenu("health-analysis");
    } else if (location.pathname.startsWith("/dashboard/diabetes-analysis")) {
      setActiveMenu("diabetes-analysis");
    } else if (location.pathname.startsWith("/dashboard/chatbot")) {
      setActiveMenu("chatbot");
    } else if (location.pathname.startsWith("/dashboard/appointments")) {
      setActiveMenu("appointments");
    }
  }, [location.pathname]);

  return (
    <Container fluid sx={classes.container}>
      <AppBar position="static" sx={classes.appBar}>
        <Toolbar sx={classes.toolbar} className="mobile-dashboard-navbar">
          {MenuData.map((item, index) => (
            <IconButton
              key={index}
              sx={{
                ...classes.menuButton,
                color: activeMenu.startsWith(item.path) ? "white" : "gray",
              }}
              onClick={
                item.submenuItems
                  ? (e) => HandleSubMenuOpen(e, item.submenuItems, item.path)
                  : () => HandleMenuClick(item.path)
              }
            >
              <Typography
                sx={
                  activeMenu.startsWith(item.path)
                    ? classes.activeMenuText
                    : classes.menuText
                }
              >
                {item.text}
              </Typography>
              {item.submenuItems && (
                <FontAwesomeIcon
                  icon={faAngleDown}
                  style={{ margin: "5px", fontSize: "0.5em" }}
                />
              )}
            </IconButton>
          ))}
        </Toolbar>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={HandleSubMenuClose}
        >
          {submenuItems.map((subItem, subIndex) => (
            <MenuItem
              key={subIndex}
              onClick={() => HandleSubMenuItemClick(subItem.path)}
            >
              {subItem.text}
            </MenuItem>
          ))}
        </Menu>
      </AppBar>
      <Container>
        <Routes>
          <Route path="menuDashboard" element={<MenuDashboard />} />
          <Route path="general-info" element={<MenuGeneralInfo />} />
          <Route path="health-analysis">
            <Route path="diabetes-analysis" element={<MenuDiabetes />} />
          </Route>
          <Route path="chatbot" element={<MenuChatbot />} />
          <Route path="appointments" element={<MenuAppointment />} />
          <Route path="*" element={<Navigate to="menuDashboard" />} />
        </Routes>
      </Container>
    </Container>
  );
};

const Dashboard = ({ windowWidth }) => {
  const dashboard = useMemo(() => {
    return windowWidth >= 992 ? <WebDashboard /> : <MobileDashboard />;
  }, [windowWidth]);
  return dashboard;
};

export default Dashboard;
