"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { profileService } from "@/services/planService";
import {
  Search,
  Loader2,
  Edit,
  UserCheck,
  UserX,
  Mail,
  Phone,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { tokenUtils } from "@/utils/auth";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string; // Changed from number to string (UUID)
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  profile_picture?: string; // Added from API
  role?: string; // Changed from object to string
  created_at?: string;
  updated_at?: string;
  status?: "active" | "inactive" | "suspended";
  auth_strategy?: string; // Added from API
  email_verified_at?: string | null; // Added from API
}

export default function AdminUsersPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [userToToggle, setUserToToggle] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const userData = tokenUtils.getUser();
    setCurrentUser(userData);

    // Fixed role check - role is now a string
    if (!userData || userData?.role.name !== "admin") {
      alert("You are not authorized to visit this page");
      router.back();
      return;
    }

    fetchUserProfile();
    fetchUsers();
  }, [router]);

  useEffect(() => {
    // Filter users when search term changes
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase()) // Fixed - removed .name
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Fixed fetch users function
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      setError(null);

      const token = tokenUtils.getToken();
      const response = await fetch(
        "https://answer24.laravel.cloud/api/v1/admin/users",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          tokenUtils.removeToken();
          tokenUtils.logout();
          router.push("/login");
          throw new Error("Session expired. Please login again.");
        }
        if (response.status === 403) {
          router.push("/unauthorized");
          throw new Error("You don't have permission to access this resource.");
        }
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();

      // Debug log to see the structure
      console.log("API Response:", data);

      // Fixed: Access the correct nested structure
      let usersArray = [];
      if (data.success && data.data && data.data.data) {
        usersArray = data.data.data; // Correct path: response.data.data.data
      } else if (data.data && Array.isArray(data.data)) {
        usersArray = data.data; // Fallback if structure changes
      } else if (Array.isArray(data)) {
        usersArray = data; // Direct array fallback
      }

      console.log("Extracted users:", usersArray);

      setUsers(usersArray);
      setFilteredUsers(usersArray);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error.message || "Failed to fetch users");
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setIsLoadingUsers(false);
      setIsLoading(false);
    }
  };

  // Update user status - fixed ID type
  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const token = tokenUtils.getToken();
      const response = await fetch(
        `https://answer24.laravel.cloud/api/v1/admin/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update user status: ${response.status}`);
      }

      const data = await response.json();

      // Update user in local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: status as any } : user
        )
      );

      return data;
    } catch (error: any) {
      console.error("Error updating user status:", error);
      throw error;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await profileService.getProfile();
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to fetch user profile");
    }
  };

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      setIsSubmitting(true);
      const response = await profileService.updateProfile(data);

      // Update both local state and localStorage
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      tokenUtils.setUser(updatedUser);

      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUserStatus = (user: UserProfile) => {
    setUserToToggle(user);
    setShowStatusDialog(true);
  };

  const confirmToggleUserStatus = async () => {
    if (!userToToggle) return;

    const newStatus = userToToggle.status === "active" ? "suspended" : "active";
    const action = newStatus === "active" ? "activated" : "suspended";

    try {
      setIsSubmitting(true);
      await updateUserStatus(userToToggle.id, newStatus);

      toast.success(
        `User ${userToToggle.name} has been ${action} successfully`
      );
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error(error.message || `Failed to ${action.slice(0, -1)} user`);
    } finally {
      setIsSubmitting(false);
      setShowStatusDialog(false);
      setUserToToggle(null);
    }
  };

  const handleRefreshUsers = () => {
    fetchUsers();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "partner":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage user accounts and profiles
            </p>
          </div>
          <Button
            onClick={handleRefreshUsers}
            disabled={isLoadingUsers}
            variant="outline"
            className="cursor-pointer"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoadingUsers ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Current Admin Profile */}
        {currentUser && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={currentUser.avatar || currentUser.profile_picture}
                  />
                  <AvatarFallback>{currentUser.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {currentUser.email}
                  </p>
                  {currentUser.phone && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {currentUser.phone}
                    </p>
                  )}
                  <Badge
                    className={`mt-2 ${getRoleColor(
                      currentUser.role || "admin"
                    )}`}
                  >
                    {currentUser.role || "Admin"}
                  </Badge>
                </div>
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hide">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (isSubmitting) return;
                        const formData = new FormData(e.currentTarget);
                        handleUpdateProfile({
                          name: formData.get("name") as string,
                          email: formData.get("email") as string,
                          phone: formData.get("phone") as string,
                        });
                      }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Name
                        </Label>
                        <input
                          id="name"
                          name="name"
                          defaultValue={currentUser.name}
                          required
                          className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email
                        </Label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={currentUser.email}
                          required
                          className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700"
                        >
                          Phone
                        </Label>
                        <input
                          id="phone"
                          name="phone"
                          defaultValue={currentUser.phone || ""}
                          placeholder="Enter phone number"
                          className="w-full px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
                        >
                          {isSubmitting && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {isSubmitting ? "Updating..." : "Update Profile"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowEditDialog(false)}
                          disabled={isSubmitting}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 px-0 py-3 text-gray-700 bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none placeholder-gray-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshUsers}
                  className="ml-auto cursor-pointer"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoadingUsers && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading users...</span>
          </div>
        )}

        {/* Users List */}
        {!isLoadingUsers && (
          <div className="space-y-4">
            {Array.isArray(filteredUsers) &&
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={user.avatar || user.profile_picture}
                            />
                            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.name}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-gray-600 flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {user.phone}
                              </p>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Badge
                                className={getRoleColor(user.role || "client")}
                              >
                                {user.role}
                              </Badge>
                              <Badge
                                className={getStatusColor(
                                  user.status || "active"
                                )}
                              >
                                {user.status || "Active"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant={
                              user.status === "active"
                                ? "destructive"
                                : "default"
                            }
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handleToggleUserStatus(user)}
                            disabled={isSubmitting}
                          >
                            {user.status === "active" ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}

        {!isLoadingUsers && filteredUsers.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400 mt-2">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No users available"}
            </p>
          </div>
        )}

        <ConfirmDialog
          open={showStatusDialog}
          onOpenChange={setShowStatusDialog}
          title={
            userToToggle?.status === "active" ? "Suspend User" : "Activate User"
          }
          description={
            userToToggle
              ? `Are you sure you want to ${
                  userToToggle.status === "active" ? "suspend" : "activate"
                } ${userToToggle.name}? ${
                  userToToggle.status === "active"
                    ? "This will prevent them from accessing their account."
                    : "This will restore their access to the platform."
                }`
              : ""
          }
          confirmText={
            userToToggle?.status === "active" ? "Suspend User" : "Activate User"
          }
          cancelText="Cancel"
          variant={
            userToToggle?.status === "active" ? "destructive" : "default"
          }
          onConfirm={confirmToggleUserStatus}
          isLoading={isSubmitting}
        />
      </motion.div>
    </div>
  );
}
