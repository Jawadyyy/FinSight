import { Link } from "react-router-dom";
import AuthSplit from "../components/AuthSplit";
import LoginForm from "../components/LoginForm";

// /login — form on the left, product panel on the right.
export default function LoginPage() {
  return (
    <AuthSplit
      panel="right"
      title="Welcome back"
      subtitle="Please enter your details"
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
