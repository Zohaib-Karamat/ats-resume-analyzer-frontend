import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../schemas/authSchemas";
import { useRegister } from "../hooks/useRegister";
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

export function Register() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created successfully! Please sign in.");
      navigate("/login", { replace: true });
    } catch (error) {
      // A generic toast is already shown by the axios interceptor; if the
      // backend flagged specific fields (e.g. email already in use), surface
      // those inline too.
      applyServerFieldErrors(error, setError);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-zinc-300">
              Full Name
            </label>
            <Input type="text" placeholder="John Doe" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-rose-500">{errors.name.message}</p>
            )}
          </div>
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
              Password
            </label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-rose-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none dark:text-zinc-300">
              Confirm Password
            </label>
            <Input type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-sm text-rose-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            type="submit"
            isLoading={registerMutation.isPending}
          >
            Create account
          </Button>
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
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
