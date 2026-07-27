import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyEmailSchema } from "../schemas/authSchemas";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useResendVerificationOtp } from "../hooks/useResendVerificationOtp";
import { applyServerFieldErrors } from "../../../lib/errorUtils";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import toast from "react-hot-toast";

export function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerificationOtp();
  const initialEmail = location.state?.email || "";

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: initialEmail,
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await verifyMutation.mutateAsync(data);
      toast.success("Email verified. You can sign in now.");
      navigate("/login", { replace: true, state: { email: data.email } });
    } catch (error) {
      applyServerFieldErrors(error, setError);
    }
  };

  const onResendOtp = async () => {
    const email = getValues("email");
    const emailResult = verifyEmailSchema.shape.email.safeParse(email);

    if (!emailResult.success) {
      setError("email", {
        type: "manual",
        message: "Enter a valid email before resending OTP",
      });
      return;
    }

    try {
      await resendMutation.mutateAsync({ email });
      toast.success("Verification OTP sent.");
    } catch (error) {
      applyServerFieldErrors(error, setError);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Verify email</CardTitle>
        <CardDescription className="text-center">
          Enter the OTP sent to your email to activate your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-zinc-300">
              Email
            </label>
            <Input
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-rose-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-zinc-300">
              OTP
            </label>
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter your 6-digit code"
              {...register("otp")}
            />
            {errors.otp && (
              <p className="text-sm text-rose-500">{errors.otp.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            type="submit"
            isLoading={verifyMutation.isPending}
          >
            Verify email
          </Button>
          <Button
            className="w-full"
            type="button"
            variant="secondary"
            isLoading={resendMutation.isPending}
            onClick={onResendOtp}
          >
            Resend OTP
          </Button>
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already verified?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
