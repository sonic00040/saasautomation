import { PasswordResetForm } from "@/components/forms/password-reset-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PasswordResetPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordResetForm />
        </CardContent>
      </Card>
    </div>
  );
}
