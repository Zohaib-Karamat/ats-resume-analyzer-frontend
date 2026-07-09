import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPasswordSchema } from "../schemas/authSchemas";
import { useResetPassword } from "../hooks/useResetPassword";
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

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetMutation = useResetPassword();
  const initialEmail = location.state?.email || "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await resetMutation.mutateAsync(data);
      toast.success("Password reset successfully. Please sign in.");
      navigate("/login", { replace: true, state: { email: data.email } });
    } catch (error) {
      applyServerFieldErrors(error, setError);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Reset password</CardTitle>
        <CardDescription className="text-center">
          Enter your OTP and choose a new password
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
              placeholder="123456"
              {...register("otp")}
            />
            {errors.otp && (
              <p className="text-sm text-rose-500">{errors.otp.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-zinc-300">
              New password
            </label>
            <Input type="password" {...register("newPassword")} />
            {errors.newPassword && (
              <p className="text-sm text-rose-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-zinc-300">
              Confirm new password
            </label>
            <Input type="password" {...register("confirmNewPassword")} />
            {errors.confirmNewPassword && (
              <p className="text-sm text-rose-500">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            type="submit"
            isLoading={resetMutation.isPending}
          >
            Reset password
          </Button>
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Need a new OTP?{" "}
            <Link
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Request one
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
