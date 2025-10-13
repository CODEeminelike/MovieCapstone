import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeTemplate from "./pages/HomeTemplate";
import HomePage from "./pages/HomeTemplate/HomePage";
import AboutPage from "./pages/HomeTemplate/AboutPage";
import ListMoviePage from "./pages/HomeTemplate/ListMoviePage";
import AdminTemplate from "./pages/AdminTemplate";
import Dashboard from "./pages/AdminTemplate/Dashboard";
import AddUserPage from "./pages/AdminTemplate/AddUserPage";
import DetailPage from "./pages/HomeTemplate/DetailPage";
import AuthPage from "./pages/AdminTemplate/AuthPage";
import { renderRoutes } from "./routes";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>{renderRoutes()}</Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
