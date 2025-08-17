"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { PrivateNavbar } from "./PrivateNavbar";

const Header = () => {
  const pathname = usePathname();

  // Define routes that should have the private navbar
  const privateRoutes = [
    "/account",
    "/account/chat",
    "/wallet",
    "/dashboard", // Fixed: added missing leading slash
    "/client/avatar",
    "/client/autoservicejanssen",
    "/admin",
    "/admin/blog",
    "/admin/client-domain-management",
    "/pricing",
  ];

  // Check if the current route is a private route
  // Handle internationalized routes by removing locale prefix
  const normalizedPathname = pathname.replace(/^\/[a-z]{2}/, "") || "/";
  const isPrivateRoute = privateRoutes.some(
    (route) =>
      normalizedPathname.startsWith(route) || normalizedPathname.includes(route)
  );

  return isPrivateRoute ? <PrivateNavbar /> : <Navbar />;
};

export default Header;
