import { createBrowserRouter } from "react-router-dom";
import NoMatch from "./NoMatch";
import App from "../App";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  { path: "*", element: <NoMatch /> },
]);
