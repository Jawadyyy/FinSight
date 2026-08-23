import { Link } from "react-router-dom";
import AuthSplit from "../components/AuthSplit";
import RegisterForm from "../components/RegisterForm";

// /register — mirrored: panel on the left pointing back at login.
export default function RegisterPage() {
  return (
    <AuthSplit
      panel="left"
      title="Create Account"
      panelTitle="Welcome Back!"
      panelBody="To keep connected with your budgets and statements, please log in with your personal info."
      panelCta={{ label: "Sign in", to: "/login" }}
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#644fef] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthSplit>
  );
}
