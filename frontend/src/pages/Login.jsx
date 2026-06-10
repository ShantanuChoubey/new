import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Login() {
  const { handleLogin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  // Already logged in → dashboard
  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const result = await handleLogin(data);
    if (result.success) {
      // Redirect to OTP page, pass email so user doesn't retype
      navigate(ROUTES.VERIFY_LOGIN_OTP, { state: { email: data.email } });
    }
  };

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-secondary-900">Welcome back</h1>
        <p className="text-secondary-500 text-sm mt-1">
          We'll send a login OTP to your email
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required.",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email." },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={16} />}
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required.",
            minLength: { value: 6, message: "Password must be at least 6 characters." },
          })}
        />

        <Button type="submit" fullWidth isLoading={isLoading} size="md" className="mt-2">
          Send OTP
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
