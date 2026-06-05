import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

function Register() {
  const { registerUser, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const passwordValue = watch("password", "");

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...payload } = data;
    const result = await registerUser(payload);
    if (result.success) navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-secondary-900">Create an account</h1>
        <p className="text-secondary-500 text-sm mt-1">
          Get started for free — no credit card required
        </p>
      </div>

      {error && !isLoading && <ErrorMessage error={error} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          leftIcon={<User size={16} />}
          error={errors.name?.message}
          {...register("name", {
            required: "Full name is required.",
            minLength: { value: 2, message: "Name must be at least 2 characters." },
          })}
        />

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
          hint="At least 8 characters."
          {...register("password", {
            required: "Password is required.",
            minLength: { value: 8, message: "Password must be at least 8 characters." },
          })}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "Please confirm your password.",
            validate: (value) =>
              value === passwordValue || "Passwords do not match.",
          })}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          size="md"
          className="mt-2"
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-secondary-600">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Register;
