import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./Button";
import { getErrorMessage } from "../../utils/helpers";

/**
 * User-friendly error display with optional retry button.
 *
 * @prop {Error|string|object} error  - error value
 * @prop {Function}            onRetry - optional callback to re-try action
 * @prop {string}              title   - custom title (default "Something went wrong")
 */
function ErrorMessage({ error, onRetry, title = "Something went wrong" }) {
  const message = getErrorMessage(error);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-col items-center gap-4 p-8 text-center max-w-md mx-auto"
    >
      <div className="rounded-full bg-red-50 p-3">
        <AlertCircle size={28} className="text-red-600" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
        <p className="text-sm text-secondary-600">{message}</p>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw size={15} />}
        >
          Try again
        </Button>
      )}
    </motion.div>
  );
}

export default ErrorMessage;
