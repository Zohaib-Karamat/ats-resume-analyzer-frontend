import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { User, Lock, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/useAuth";
import {
  profileUpdateSchema,
  passwordUpdateSchema,
} from "../schemas/profileSchemas";
import { useChangePassword } from "../../auth/hooks/useChangePassword";
import { useUpdateProfile } from "../../auth/hooks/useUpdateProfile";
import { applyServerFieldErrors } from "../../../lib/errorUtils";

export function ProfilePage() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const profileForm = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { name: "", email: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // The backend calls this field `confirmNewPassword`; our form calls it
  // `confirmPassword`, so remap any field-level validation error onto it.
  const passwordFieldMap = { confirmNewPassword: "confirmPassword" };

  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.name || "", email: user.email || "" });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data) => {
    const payload = {};
    const nextName = data.name?.trim();
    const nextEmail = data.email?.trim();

    if (nextName && nextName !== (user?.name || "")) {
      payload.name = nextName;
    }

    if (nextEmail && nextEmail !== (user?.email || "")) {
      payload.email = nextEmail;
    }

    if (!Object.keys(payload).length) {
      profileForm.setError("root", {
        type: "manual",
        message: "Change your name or email before saving.",
      });
      return;
    }

    try {
      const updated = await updateProfileMutation.mutateAsync(payload);
      const updatedUser = updated.user ?? updated;
      profileForm.reset({
        name: updatedUser.name || nextName || "",
        email: updatedUser.email || nextEmail || "",
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      applyServerFieldErrors(error, profileForm.setError);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmPassword,
      });
      toast.success("Password changed successfully!");
      passwordForm.reset();
    } catch (error) {
      // A generic toast is already shown by the axios interceptor; if the
      // backend flagged specific fields, surface those inline too.
      applyServerFieldErrors(error, passwordForm.setError, passwordFieldMap);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col space-y-6 pb-12 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
          Account Settings
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your personal information and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Profile Info Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your name and email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-zinc-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4 w-4 text-zinc-400" />
                  </div>
                  <Input
                    {...profileForm.register("name")}
                    className="pl-10"
                    placeholder="John Doe"
                  />
                </div>
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-rose-500">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-zinc-400" />
                  </div>
                  <Input
                    {...profileForm.register("email")}
                    type="email"
                    className="pl-10"
                    placeholder="john@example.com"
                  />
                </div>
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-rose-500">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {profileForm.formState.errors.root && (
                <p className="text-sm text-rose-500">
                  {profileForm.formState.errors.root.message}
                </p>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={updateProfileMutation.isPending}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Form */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay
              secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-zinc-300">
                  Current Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-zinc-400" />
                  </div>
                  <Input
                    {...passwordForm.register("currentPassword")}
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-rose-500">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-zinc-300">
                  New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-zinc-400" />
                  </div>
                  <Input
                    {...passwordForm.register("newPassword")}
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-rose-500">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-zinc-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-zinc-400" />
                  </div>
                  <Input
                    {...passwordForm.register("confirmPassword")}
                    type="password"
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-rose-500">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={changePasswordMutation.isPending}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
