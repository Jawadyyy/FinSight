import { Link } from "react-router-dom";
import AuthSplit from "../components/AuthSplit";
import RegisterForm from "../components/RegisterForm";

// /register — mirrored: product panel on the left, form on the right.
export default function RegisterPage() {
  return (
    <AuthSplit
      panel="left"
      title="Create your account"
      subtitle="Start reading your statements in minutes"
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
