import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle, Mail, User, AtSign, Calendar } from "lucide-react";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile data
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

          <div className="grid gap-8">
            {/* Profile Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>
                  Your public profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-6 text-blue-600">
                    <UserCircle className="h-16 w-16" />
                  </div>
                  <div className="space-y-4 flex-grow">
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Display Name
                      </p>
                      <p className="font-medium">
                        {profile?.full_name || profile?.name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </p>
                      <p className="font-medium">
                        {formatDate(
                          profile?.created_at ||
                            user.created_at ||
                            new Date().toISOString(),
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            <form action="/api/update-profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={profile?.name || ""}
                        placeholder="Your display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        defaultValue={profile?.full_name || ""}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Profile Picture URL</Label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      defaultValue={profile?.avatar_url || ""}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </Card>
            </form>

            {/* Account Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Password</h3>
                  <Link href="/dashboard/reset-password">
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
