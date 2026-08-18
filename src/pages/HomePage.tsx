import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Landing screen at "/". Two buttons that route to the auth pages.
export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl">FinSight</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/register">Register</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
