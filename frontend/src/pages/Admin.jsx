import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AffiliateManagement from "../components/AffiliateManagement";
import AdManagement from "../components/AdManagement";
import Header from "../components/Header";

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

    if (!isAdminLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <AffiliateManagement />
      <AdManagement />
    </div>
  );
}

export default Admin;