import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, BarChart3 } from "lucide-react";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with Vite and React 19 for blazing performance out of the box.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "JWT-based auth, protected routes, and Axios interceptors keep your data safe.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: BarChart3,
    title: "Scalable Architecture",
    description: "Modular folder structure, reusable components, and a clean service layer.",
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="animate-slide-up">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-100 py-24 md:py-36">
        <div className="container-app text-center space-y-8">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 py-1.5 text-xs font-semibold text-primary-700 bg-primary-100 rounded-full"
          >
            ✦ Production-Ready React Starter
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Build faster with{" "}
            <span className="text-gradient">modern React</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto text-lg text-secondary-600 leading-relaxed"
          >
            A professional, scalable frontend starter — React 19, Vite, Tailwind CSS,
            React Router, Axios, Framer Motion and more, all pre-configured.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                rightIcon={<ArrowRight size={18} />}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Get started free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Sign in
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-white">
        <div className="container-app">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-secondary-900">
              Everything you need to ship
            </h2>
            <p className="mt-3 text-secondary-500 text-base">
              A solid foundation so you can focus on your product, not the plumbing.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="card hover:shadow-md transition-shadow duration-300 group"
              >
                <div className={`inline-flex items-center justify-center rounded-xl p-3 mb-5 ${bg}`}>
                  <Icon size={24} className={color} />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
                <p className="text-secondary-500 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-primary-600">
        <div className="container-app text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Ready to build something great?
          </h2>
          <p className="text-primary-100 text-base max-w-md mx-auto">
            Sign up in seconds and start shipping features, not boilerplate.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER)}
            rightIcon={<ArrowRight size={18} />}
          >
            {isAuthenticated ? "Open Dashboard" : "Create your account"}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;
