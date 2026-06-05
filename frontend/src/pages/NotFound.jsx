import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants/routes";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-secondary-400">
            404
          </h1>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-secondary-900">Page not found</h2>
          <p className="text-secondary-500 text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft size={16} />}
          >
            Go back
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(ROUTES.HOME)}
            leftIcon={<Home size={16} />}
          >
            Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;
