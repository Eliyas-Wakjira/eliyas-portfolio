/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Frontend Entry Point (MVC Architecture)
 */
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
createRoot(document.getElementById("root")).render(<App />);
