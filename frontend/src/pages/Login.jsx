import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

function Login() {
  const { loginUser, isLoading, error, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname ?? ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data) => {
    const result = await loginUser(data);
    if (result.success) navigate(from, { replace: true });
  };

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-secondary-900">Welcome back</h1>
        <p className="text-secondary-500 text-sm mt-1">
          Sign in to your account to continue
        </p>
      </div>

      {error && !isLoading && <ErrorMessage error={error} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email address.",
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          hint="Minimum 8 characters."
          {...register("password", {
            required: "Password is required.",
            minLength: { value: 8, message: "Password must be at least 8 characters." },
          })}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          size="md"
          className="mt-2"
        >
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-secondary-600">
        Don&apos;t have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default Login;
