import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import './index.css'
import App from './pages/App.tsx'
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <App />,
  },
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "/home",
    element: <Home></Home>
  }

]);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);