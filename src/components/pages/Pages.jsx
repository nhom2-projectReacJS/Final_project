import React from "react";
import Header from "../common/header/Header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "../home/Home";
import Footer from "../common/footer/Footer";
import About from "../about/About";
import Services from "../services/Services";
import Blog from "../blog/Blog";
import CreateEstate from "../common/estate/CreateEstate";
import PrivateRoute from "../common/route-config/PrivateRoute";
import HomeAdmin from "../../admin/Layout/HomeAdmin";
import Dashboard from "../../admin/component/Dashboard";
import ManageUsers from "../../admin/Layout/ManageUsers";
import ManageEstate from "../../admin/Layout/ManageEstate";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/blog" element={<Blog />} />
        <Route
          path="/create-estate"
          element={<PrivateRoute element={CreateEstate} />}
        />

        {/* Admin routes */}
        <Route path="/admin" element={<HomeAdmin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-estates" element={<ManageEstate />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

function Pages() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default Pages;
