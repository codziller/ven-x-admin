import React from "react";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";
import DashboardLayout from "components/Layout/DashboardLayout";

const AbandonedCarts = () => {
  return (
    <div>
      <Helmet>
        <title>Abandoned Carts - Ven-x</title>
      </Helmet>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </div>
  );
};

export default AbandonedCarts;
