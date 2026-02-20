"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useDashboardSession } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const session = useDashboardSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [image, setImage] = useState(session?.user?.image ?? "");
  const [saving, setSaving] = useState(false);

  const email = session?.user?.email ?? "";
  const hasChanges =
    name !== (session?.user?.name ?? "") ||
    image !== (session?.user?.image ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasChanges) return;
    setSaving(true);
    const { error } = await authClient.updateUser({
      name: name.trim() || undefined,
      image: image.trim() || undefined,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message ?? "Failed to update profile");
      return;
    }
    toast.success("Profile updated");
    router.refresh();
  }

  if (!session?.user) return null;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex flex-col gap-1 px-4 lg:px-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-muted-foreground text-sm">
            Manage your account information
          </p>
        </div>
        <div className="px-4 lg:px-6 max-w-xl">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold">
                  Personal information
                </CardTitle>
                <CardDescription>
                  Update your name and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar size="lg" className="size-16">
                    {image ? (
                      <AvatarImage src={image} alt="" />
                    ) : null}
                    <AvatarFallback className="text-lg">
                      {getInitials(name || session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="image">Profile picture URL</Label>
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-muted-foreground text-xs">
                    Email cannot be changed. Contact support if you need to
                    update it.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="mt-4">
                <Button type="submit" disabled={saving || !hasChanges}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
