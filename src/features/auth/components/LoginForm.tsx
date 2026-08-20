import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { login, googleLogin } from "../api/authApi";
import { loginSchema, type LoginFields } from "../schemas/authSchema";

export default function LoginForm() {
  const form = useForm<LoginFields>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });
  const {
    setError,
    formState: { errors, isSubmitting },
  } = form;

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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errors.root && (
            <Alert variant="destructive">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full bg-[#644fef] text-white hover:bg-[#5540d8]"
          >
            {isSubmitting ? "Signing in..." : "Log in"}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Google's own sign-in button (popup). onSuccess gives the ID token. */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(cred) => handleGoogle(cred.credential)}
          onError={() => setError("root", { message: "Google sign-in failed" })}
        />
      </div>
    </>
  );
}
