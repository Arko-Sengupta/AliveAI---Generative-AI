import React from "react";
import "../../StyleSheets/DashboardMenu.css";
import { Button } from "react-bootstrap";

const CustomButton = ({
  textColor,
  bgColor,
  hoverColor,
  children,
  ...props
}) => {
  const buttonStyle = {
    "--text-color": textColor,
    "--bg-color": bgColor,
    "--hover-color": hoverColor,
  };

  return (
    <Button className="custom-button" style={buttonStyle} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
