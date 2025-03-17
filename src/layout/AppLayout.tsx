import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/NavBar";
import TopBar from "../components/ui/TopBar";
//import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
//import Home from "../pages/Home";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="pt-[60px] pb-[80px] mx-3">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
};

export default AppLayout;
