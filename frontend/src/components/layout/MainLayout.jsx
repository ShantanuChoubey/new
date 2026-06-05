import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
