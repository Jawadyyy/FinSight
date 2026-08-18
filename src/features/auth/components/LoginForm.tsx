import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { login, googleLogin } from "../api/authApi";
import { loginSchema, type LoginFields } from "../schemas/authSchema";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    try {
      const res = await login(data.email, data.password);
      setAuth(res); // store token + user, attach axios Authorization header
      navigate("/dashboard");
    } catch {
      // The backend returns 401 "Invalid email or password".
      setError("root", { message: "Invalid email or password" });
    }
  };

  // Called by @react-oauth/google with the Google ID token ("credential").
  // We hand it to the backend, which verifies it and returns our own tokens.
  const handleGoogle = async (credential?: string) => {
    if (!credential) return;
    try {
      const res = await googleLogin(credential);
      setAuth(res);
      navigate("/dashboard");
    } catch {
      setError("root", { message: "Google sign-in failed" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Loading..." : "Sign In"}
            </Button>
          </form>

          {/* Google's own sign-in button (popup). onSuccess gives the ID token. */}
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={(cred) => handleGoogle(cred.credential)}
              onError={() => setError("root", { message: "Google sign-in failed" })}
            />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account yet?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Register now
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
