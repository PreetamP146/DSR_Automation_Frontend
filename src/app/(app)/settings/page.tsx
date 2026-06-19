"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth-store";
import { useGitIntegrations } from "@/hooks/use-git";
import { usePlanningIntegrations } from "@/hooks/use-activity";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: gitIntegrations } = useGitIntegrations();
  const { data: planningIntegrations } = usePlanningIntegrations();
  const [notifications, setNotifications] = useState({
    email: true,
    dsrReminder: true,
    syncAlerts: false,
  });

  const handleSaveNotifications = () => {
    toast.info("Notification preferences are stored locally (no backend endpoint yet)");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and integrations</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information from login session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={user?.name ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email ?? ""} disabled />
              </div>
              <p className="text-xs text-muted-foreground">
                Profile update endpoint is not available in the backend yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" disabled />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" disabled />
              </div>
              <Button disabled>Change password</Button>
              <p className="text-xs text-muted-foreground">
                Change password endpoint is not available in the backend yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Git Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {gitIntegrations?.integrations.map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium capitalize">{i.provider}</p>
                    <p className="text-sm text-muted-foreground">@{i.username}</p>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
              ))}
              <Button variant="outline" asChild>
                <Link href="/git">Manage Git</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Planning Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {planningIntegrations?.integrations.map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium capitalize">{i.provider}</p>
                    <p className="text-sm text-muted-foreground">{i.display_name}</p>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
              ))}
              <Button variant="outline" asChild>
                <Link href="/jira">Manage Jira</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "email" as const, label: "Email notifications" },
                { key: "dsrReminder" as const, label: "Daily DSR reminders" },
                { key: "syncAlerts" as const, label: "Sync failure alerts" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{label}</span>
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={(e) =>
                      setNotifications({ ...notifications, [key]: e.target.checked })
                    }
                  />
                </label>
              ))}
              <Button onClick={handleSaveNotifications}>Save preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
