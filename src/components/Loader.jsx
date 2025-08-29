import React from "react";
import { PulseLoader } from "react-spinners";

const Loader = ({ loading }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "70vh"
      
    }}>
      <PulseLoader color="#007bff" loading={loading} size={15} />
    </div>
  );
};

export default Loader;
