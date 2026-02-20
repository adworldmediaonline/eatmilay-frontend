"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

const MIN_PASSWORD_LENGTH = 8;

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const newPasswordValid =
    newPassword.length >= MIN_PASSWORD_LENGTH || newPassword.length === 0;
  const canSubmit =
    currentPassword.trim() !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    passwordsMatch &&
    newPasswordValid;

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setChanging(true);
    const { error } = await authClient.changePassword({
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
    });
    setChanging(false);
    if (error) {
      toast.error(error.message ?? "Failed to change password");
      return;
    }
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-col gap-1 px-4 lg:px-6">
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-muted-foreground text-sm">
            Manage your account settings
          </p>
        </div>
        <div className="px-4 lg:px-6 max-w-xl space-y-6">
          <Card>
            <form onSubmit={handlePasswordChange}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold">
                  Change password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={changing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={changing}
                  />
                  {newPassword.length > 0 && !newPasswordValid && (
                    <p className="text-destructive text-xs">
                      Password must be at least {MIN_PASSWORD_LENGTH} characters
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm new password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={changing}
                  />
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-destructive text-xs">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={!canSubmit || changing}>
                  {changing ? "Changing…" : "Change password"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <Collapsible open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <CardHeader>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between text-left"
                  >
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-semibold">
                        Notifications
                      </CardTitle>
                      <CardDescription>
                        Manage email and push notification preferences
                      </CardDescription>
                    </div>
                    <ChevronDownIcon
                      className={`size-5 transition-transform ${notificationsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <Separator />
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Order updates</p>
                      <p className="text-muted-foreground text-sm">
                        Get notified when your order status changes
                      </p>
                    </div>
                    <Switch disabled />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Promotions</p>
                      <p className="text-muted-foreground text-sm">
                        Receive offers and discounts
                      </p>
                    </div>
                    <Switch disabled />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Coming soon. Notification preferences will be available in a
                    future update.
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
      </div>
    </div>
  );
}
