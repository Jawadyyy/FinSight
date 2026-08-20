import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { registerUser } from "../api/authApi";
import { registerSchema, type RegisterFields } from "../schemas/authSchema";

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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" {...field} />
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
                  <Input type="password" autoComplete="new-password" {...field} />
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
            {isSubmitting ? "Creating account..." : "Create account"}
            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        By creating an account you agree to our terms of service and privacy policy.
      </p>
    </>
  );
}
