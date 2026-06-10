import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute    from "./PublicRoute";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";

import Home               from "../pages/Home";
import Login              from "../pages/Login";
import Register           from "../pages/Register";
import VerifyRegisterOtp  from "../pages/VerifyRegisterOtp";
import VerifyLoginOtp     from "../pages/VerifyLoginOtp";
import Dashboard          from "../pages/Dashboard";
import NotFound           from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public pages with main layout ── */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
      </Route>

      {/* ── Auth pages (redirect if logged in) ── */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN}               element={<Login />} />
          <Route path={ROUTES.REGISTER}            element={<Register />} />
          <Route path={ROUTES.VERIFY_REGISTER_OTP} element={<VerifyRegisterOtp />} />
          <Route path={ROUTES.VERIFY_LOGIN_OTP}    element={<VerifyLoginOtp />} />
        </Route>
      </Route>

      {/* ── Protected pages ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        </Route>
      </Route>

      {/* ── 404 ── */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
