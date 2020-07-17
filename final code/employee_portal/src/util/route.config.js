import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { PrivateRoute } from "./requireAuth";
import { getCurrentUser } from "../services/auth.service";

import Login from "../components/User/Login";
import Dashboard from "../components/Dashboard/Dashboard";
import NotFound from "../components/NotFound/NotFound";
import ForgotPassword from "../components/User/ForgotPassword";
import ViewAllCustomers from "../components/Customer/ViewAllCustomer";
import ViewAllEmployees from "../components/Employee/ViewAllEmployee";
import Chat from "../components/Chat/ChatApp";
import AddEmployee from "../components/Employee/AddEmployee";
import AddCustomer from "../components/Customer/AddCustomer";
import Profile from "../components/Profile/ViewProfile";

import UpdateProfile from "../components/Profile/UpdateProfile";

const routes = [
  {
    path: "/login",
    component: Login,
    type: "Public",
  },
  {
    path: "/forgotpassword",
    component: ForgotPassword,
    type: "Public",
  },
  {
    path: "/dashboard",
    component: Dashboard,
    type: "Private",
  },
  {
    path: "/profile",
    component: Profile,
    type: "Private",
  },
  {
    path: "/updateprofile",
    component: UpdateProfile,
    type: "Private",
  },

  {
    path: "/customers",
    component: ViewAllCustomers,
    type: "Private",
  },
  {
    path: "/employees",
    component: ViewAllEmployees,
    type: "Private",
  },
  {
    path: "/addemployee",
    component: AddEmployee,
    type: "Private",
  },
  {
    path: "/addcustomer",
    component: AddCustomer,
    type: "Private",
  },
  {
    path: "/chat",
    component: Chat,
    type: "Private",
  },
  // {
  //   path: "/regions",
  //   component: Regions,
  //   type: "Private"
  // },
  // {
  //   path: "/region/:id",
  //   component: SingleRegion,
  //   type: "Private"
  // },
  // {
  //   path: "/posts/:id",
  //   component: SingleCatalog,
  //   type: "Private"
  // }
];

function RouteWithSubRoutes(route) {
  const user = getCurrentUser();
  if (route.type === "Public") {
    return (
      <Route
        path={route.path}
        render={(props) => (
          // pass the sub-routes down to keep nesting
          <route.component {...props} routes={route.routes} />
        )}
      />
    );
  } else {
    return (
      <Route
        path={route.path}
        render={(props) =>
          user ? (
            <route.component {...props} user={user} routes={route.routes} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
              }}
            />
          )
        }
      />
    );
  }
}

const Routing = () => {
  return (
    <div>
      <Switch>
        {/* This route is exception as it is "/" route which needs to be exact */}
        <PrivateRoute exact path="/" component={Dashboard} />

        {routes.map((route, i) => {
          return <RouteWithSubRoutes key={i} {...route} />;
        })}

        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default Routing;
