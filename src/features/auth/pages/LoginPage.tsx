import { Link } from "react-router-dom";
import AuthSplit from "../components/AuthSplit";
import LoginForm from "../components/LoginForm";

// /login — form on the left, panel on the right pointing at register.
export default function LoginPage() {
  return (
    <AuthSplit
      panel="right"
      title="Sign in"
      panelTitle="Hello, Friend!"
      panelBody="Create an account and let FinSight read your statements, sort them, and tell you where the money went."
      panelCta={{ label: "Sign up", to: "/register" }}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-[#644fef] hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthSplit>
  );
}
