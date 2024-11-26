import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import './index.css';
import AllRoutes from "./routes/index.js";

const App = () => (
  <div>
    <BrowserRouter>
      <AllRoutes />
    </BrowserRouter>
  </div>
);
const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
