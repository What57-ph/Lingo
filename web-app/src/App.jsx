import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import TestPage from './pages/TestPage';
import AuthLayout from './layouts/AuthLayout';
import LoginPage from './pages/LoginPage';
import ClientLayout from './layouts/ClientLayout';
import HomePage from './pages/HomePage';
function App() {
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (
        <AdminLayout />
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />
        },
        {
          path: "user",
          element: <UserPage />
        },
        {
          path: "test",
          element: <TestPage />
        }
      ]
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        }
      ],
    },
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        }
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App
