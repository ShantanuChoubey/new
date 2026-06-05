import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import { APP_NAME, APP_VERSION } from "../../constants/app";
import { ROUTES } from "../../constants/routes";

const currentYear = new Date().getFullYear();

const socialLinks = [
  { href: "https://github.com",   icon: Github,   label: "GitHub"   },
  { href: "https://twitter.com",  icon: Twitter,  label: "Twitter"  },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

function Footer() {
  return (
    <footer className="bg-white border-t border-secondary-200 mt-auto">
      <div className="container-app py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand + tagline */}
          <div className="text-center md:text-left">
            <Link to={ROUTES.HOME} className="text-lg font-bold text-gradient">
              {APP_NAME}
            </Link>
            <p className="text-sm text-secondary-500 mt-1">
              Building great products, one commit at a time.
            </p>
          </div>

          {/* Quick links */}
          <nav className="flex gap-6 text-sm text-secondary-600">
            <Link to={ROUTES.HOME}      className="hover:text-primary-600 transition-colors">Home</Link>
            <Link to={ROUTES.DASHBOARD} className="hover:text-primary-600 transition-colors">Dashboard</Link>
            <Link to={ROUTES.LOGIN}     className="hover:text-primary-600 transition-colors">Login</Link>
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-secondary-400 hover:text-primary-600 transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <p className="mt-8 text-center text-xs text-secondary-400">
          © {currentYear} {APP_NAME} v{APP_VERSION}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
