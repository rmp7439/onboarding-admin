import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import AdminLayout from "../layouts/AdminLayout";
import Admins from "../pages/Admins/";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import EmployeeDetails from "../pages/EmployeeDetails";
import Reports from "../pages/Reports";
import Users from "../pages/Users";
import Units from "../pages/Units/index";
import NotFound from "../pages/NotFound";
import ActivityLogs from "../pages/ActivityLogs";
import Banks from "../pages/Banks";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "employees",
            element: <Employees />,
          },
          {
            path: "employees/:id",
            element: <EmployeeDetails />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "units",
            element: <Units />,
          },
          {
            path: "banks",
            element: <Banks />,
          },
          {
            path: "admins",
            element: <Admins />,
          },
          {
            path: "logs",
            element: <ActivityLogs />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);