import React from "react";
import { PulseLoader } from "react-spinners";

const ActionLoader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
      }}
    >
      <PulseLoader color="#007bff" size={15} />
    </div>
  );
};

export default ActionLoader;
