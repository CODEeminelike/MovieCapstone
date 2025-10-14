import { Outlet } from "react-router-dom";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import Banner from "./HomePage/BannerPage";

export default function HomeTemplate() {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
