import { string, bool, node } from "prop-types";
import { Navigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import DashboardLayout from "components/Layout/DashboardLayout";
import TestModeIndicator from "components/General/TestMode/TestModeIndicator";

export const ProtectedRoute = ({ path, notProtected, children, ...rest }) => {
  const { isAuthenticated } = useAuth();

  if (notProtected && isAuthenticated) {
    return (
      <DashboardLayout>
        <Navigate replace to="/dashboard/home" />;
      </DashboardLayout>
    );
  }

  if (!isAuthenticated && !notProtected) {
    return (
      <Navigate
        replace
        to={{
          pathname: "/",
          state: {
            prevLocation: path,
            error: "You need to login first!",
          },
        }}
        exact
      />
    );
  }

  return (
    <div>
      <TestModeIndicator />
      {children}
    </div>
  );
};

ProtectedRoute.propTypes = {
  notProtected: bool,
  path: string.isRequired,
  children: node,
};

ProtectedRoute.defaultProps = {
  notProtected: false,
};
