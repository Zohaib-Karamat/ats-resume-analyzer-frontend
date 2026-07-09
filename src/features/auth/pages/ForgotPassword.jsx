import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordSchema } from "../schemas/authSchemas";
import { useForgotPassword } from "../hooks/useForgotPassword";
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

export function ForgotPassword() {
  const navigate = useNavigate();
  const forgotMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await forgotMutation.mutateAsync(data);
      toast.success("Password reset OTP sent.");
      navigate("/reset-password", { state: { email: data.email } });
    } catch (error) {
      applyServerFieldErrors(error, setError);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Forgot password</CardTitle>
        <CardDescription className="text-center">
          Enter your account email to receive a reset OTP
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            type="submit"
            isLoading={forgotMutation.isPending}
          >
            Send reset OTP
          </Button>
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Remembered your password?{" "}
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
