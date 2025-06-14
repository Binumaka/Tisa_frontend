import ReactDOM from "react-dom/client"; // Import createRoot
import App from "./App";
import "./index.css"; // Ensure this file contains Tailwind's directives
import { AuthProvider } from "./private/context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root")); // Use createRoot
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
