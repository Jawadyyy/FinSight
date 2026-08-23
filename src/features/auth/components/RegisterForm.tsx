import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
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
import { registerUser, googleLogin } from "../api/authApi";
import { registerSchema, type RegisterFields } from "../schemas/authSchema";
import { FIELD, SUBMIT } from "./field-styles";

export default function RegisterForm() {
  const form = useForm<RegisterFields>({
    defaultValues: { name: "", email: "", password: "" },
    resolver: zodResolver(registerSchema),
  });
  const {
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFields> = async (data) => {
    try {
      const res = await registerUser(data.name, data.email, data.password);
      setAuth(res);
      navigate("/dashboard");
    } catch (err) {
      // 409 = email already exists; anything else = generic.
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      setError("root", {
        message: status === 409 ? "Email already registered" : "Something went wrong",
      });
    }
  };

  // The backend find-or-creates on a Google identity, so the same call that
  // signs an existing user in registers a new one.
  const handleGoogle = async (credential?: string) => {
    if (!credential) return;
    try {
      setAuth(await googleLogin(credential));
      navigate("/dashboard");
    } catch {
      setError("root", { message: "Google sign-up failed" });
    }
  };

  return (
    <>
      <p className="mb-5 mt-4 text-center text-xs text-muted-foreground">
        use your email for registration
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                {/* The placeholder carries the label visually; screen readers
                    still get a real one. */}
                <FormLabel className="sr-only">Name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Name" className={FIELD} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    className={FIELD}
                    {...field}
                  />
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
                <FormLabel className="sr-only">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    className={FIELD}
                    {...field}
                  />
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

          <Button type="submit" disabled={isSubmitting} className={SUBMIT}>
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </Form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Google's own button (popup). The backend find-or-creates, so this
          registers a new identity just as well as it signs an existing one in. */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(cred) => handleGoogle(cred.credential)}
          onError={() => setError("root", { message: "Google sign-up failed" })}
        />
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        By creating an account you agree to our terms of service and privacy policy.
      </p>
    </>
  );
}
