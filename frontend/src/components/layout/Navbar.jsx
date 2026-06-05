import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";
import { APP_NAME } from "../../constants/app";
import Button from "../ui/Button";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors duration-200 ${
    isActive
      ? "text-primary-600"
      : "text-secondary-600 hover:text-secondary-900"
  }`;

function Navbar() {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-200 shadow-sm">
      <div className="container-app flex items-center justify-between h-16">

        {/* Brand */}
        <Link to={ROUTES.HOME} className="text-xl font-bold text-gradient">
          {APP_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to={ROUTES.HOME} className={navLinkClass}>
            Home
          </NavLink>
          {isAuthenticated && (
            <NavLink to={ROUTES.DASHBOARD} className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-secondary-500">
                Hi, <span className="font-medium text-secondary-800">{user?.name ?? "User"}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                leftIcon={<LogOut size={15} />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
                leftIcon={<LogIn size={15} />}
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(ROUTES.REGISTER)}
                leftIcon={<UserPlus size={15} />}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-secondary-100 bg-white"
          >
            <div className="container-app py-4 flex flex-col gap-4">
              <NavLink
                to={ROUTES.HOME}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </NavLink>
              {isAuthenticated && (
                <NavLink
                  to={ROUTES.DASHBOARD}
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </span>
                </NavLink>
              )}
              <div className="flex gap-3 pt-2 border-t border-secondary-100">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    leftIcon={<LogOut size={15} />}
                    fullWidth
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { navigate(ROUTES.LOGIN); setMenuOpen(false); }}
                      fullWidth
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => { navigate(ROUTES.REGISTER); setMenuOpen(false); }}
                      fullWidth
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
