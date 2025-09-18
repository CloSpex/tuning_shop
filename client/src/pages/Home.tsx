import React from "react";
import { useNavigate } from "react-router-dom";
const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to the Tuning Shop</h1>
      <p>Your one-stop shop for all your car tuning needs.</p>
    </div>
  );
};

export default Home;
