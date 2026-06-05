import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { APP_NAME } from "../../constants/app";
import { ROUTES } from "../../constants/routes";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Brand */}
      <Link to={ROUTES.HOME} className="mb-8 text-2xl font-bold text-gradient">
        {APP_NAME}
      </Link>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}

export default AuthLayout;
