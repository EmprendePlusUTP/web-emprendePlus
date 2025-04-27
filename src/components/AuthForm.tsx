// src/components/AuthForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";
import GoogleLogo from "./Logos/GoogleLogo";
import MicrosoftLogo from "./Logos/MicrosoftLogo";

export type AuthFormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export interface AuthFormProps {
  mode: "signin" | "signup";
  onModeChange: (mode: "signin" | "signup") => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>();
  const password = watch("password", "");
  const { loginWithRedirect } = useAuth0();

  const onSubmit = async (data: AuthFormData) => {
    // Lanza el flujo de Auth0, pasando login_hint y forzando el proveedor si se quiere
    await loginWithRedirect({
      authorizationParams: {
        login_hint: data.email,
        ...(mode === "signup" ? { screen_hint: "signup" } : {}),
      },
    });
  };

  return (
    <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900/80 dark:border-neutral-700 z-10 w-full max-w-md">
      <div className="p-4 sm:p-7">
        {/* Header dinámico */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {mode === "signin" ? "Sign in" : "Sign up"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            {mode === "signin"
              ? "Don’t have an account yet?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                onModeChange(mode === "signin" ? "signup" : "signin")
              }
              className="text-blue-600 decoration-2 hover:underline focus:outline-none font-medium dark:text-blue-500"
            >
              {mode === "signin" ? "Sign up here" : "Sign in here"}
            </button>
          </p>
        </div>

        {/* Social Buttons */}
        <div className="mt-5 space-y-3">
          {/* Google */}
          <button
            type="button"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { connection: "google-oauth2" },
              })
            }
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            {/* SVG Google */}
            <div className="w-4 h-auto">
              <GoogleLogo />
            </div>

            {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
          </button>

          {/* Microsoft */}
          <button
            type="button"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { connection: "windowslive" },
              })
            }
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-none disabled:opacity-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
          >
            {/* SVG Microsoft (ejemplo) */}
            <div className="w-4 h-auto">
              <MicrosoftLogo />
            </div>

            {mode === "signin"
              ? "Sign in with Microsoft"
              : "Sign up with Microsoft"}
          </button>
        </div>

        {/* Divider */}
        <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500">
          Or with email
        </div>

        {/* Email + Password Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2 dark:text-white"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-2 dark:text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 chars" },
                })}
                className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password (solo en signup) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm mb-2 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm",
                    validate: (v) => v === password || "Passwords do not match",
                  })}
                  className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Redirecting…"
                : mode === "signin"
                ? "Sign in"
                : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
