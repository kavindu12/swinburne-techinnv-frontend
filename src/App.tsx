import Layout from "./Layout";
import FileUpload from "./FileUpload";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Outlet } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import { SystemAnalysis } from "./SystemAnalysis";
import Predictions from "./Predictions";
import { Realtime, Simulation } from "./RealTime";
import SignIn from "./Signin";
import { DataRefresher } from "./api";

function UnderConstruction() {
  return "This page is under construction";
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet></Outlet>}>
      <Route path="/login" element={<SignIn />}></Route>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/alerts" element={<UnderConstruction />}></Route>
        <Route path="/analysis" element={<SystemAnalysis />}></Route>
        <Route path="/realtime" element={<Realtime />}></Route>
        <Route path="/predictions" element={<Predictions />}></Route>
        <Route path="/upload" element={<FileUpload />}></Route>
        <Route path="/users" element={<UnderConstruction />}></Route>
        <Route path="/settings" element={<UnderConstruction />}></Route>
      </Route>
    </Route>,
  ),
);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <DataRefresher />
      <Simulation />
    </>
  );
}
