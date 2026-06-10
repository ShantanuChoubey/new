import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function VerifyLoginOtp() {
  const { handleVerifyLoginOtp, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed via navigate state from Login page
  const emailFromState = location.state?.email ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { email: emailFromState },
  });

  // Already authenticated → dashboard
  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    const result = await handleVerifyLoginOtp({
      email: data.email.trim().toLowerCase(),
      otp:   data.otp.trim(),
    });
    if (result.success) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  };

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-4">
          <KeyRound size={28} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-900">Verify login OTP</h1>
        <p className="text-secondary-500 text-sm mt-1">
          Enter the 6-digit OTP sent to{" "}
          <span className="font-medium text-secondary-700">{emailFromState || "your email"}</span>
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
          label="OTP Code"
          type="text"
          placeholder="Enter 6-digit OTP"
          leftIcon={<KeyRound size={16} />}
          error={errors.otp?.message}
          maxLength={6}
          {...register("otp", {
            required: "OTP is required.",
            minLength: { value: 6, message: "OTP must be 6 digits." },
            maxLength: { value: 6, message: "OTP must be 6 digits." },
            pattern:   { value: /^\d{6}$/, message: "OTP must be 6 digits." },
          })}
        />

        <Button type="submit" fullWidth isLoading={isLoading} size="md" className="mt-2">
          Verify &amp; Login
        </Button>
      </form>

      <p className="text-center text-sm text-secondary-600">
        Didn&apos;t get the OTP?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:text-primary-700 underline underline-offset-2"
        >
          Login again
        </Link>
      </p>
    </div>
  );
}

export default VerifyLoginOtp;
