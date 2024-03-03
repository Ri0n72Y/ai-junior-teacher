import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import English from "./English";
import Math from "./Math";

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/math", element: <Math /> },
  { path: "/english", element: <English /> },
]);
