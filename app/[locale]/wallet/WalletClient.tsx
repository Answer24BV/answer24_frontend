"use client";
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Plus,
  Wallet,
  Euro,
  Loader2,
  FileText,
  Download,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import AddMoney from "@/components/AddMoney";
import { tokenUtils } from "@/utils/auth";
import { useUser } from "@/hooks/useUser";

// --- UI Components (Recreated based on common patterns) ---

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ children, className, ...props }: CardProps) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = ({ children, className, ...props }: CardHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

interface CardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const CardTitle = ({ children, className, ...props }: CardTitleProps) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const CardDescription = ({
  children,
  className,
  ...props
}: CardDescriptionProps) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent = ({ children, className, ...props }: CardContentProps) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "icon";
}

const Button = ({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => {
  let baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  if (variant === "default") {
    baseClasses +=
      " bg-primary text-primary-foreground shadow hover:bg-primary/90";
  } else if (variant === "ghost") {
    baseClasses += " hover:bg-accent hover:text-accent-foreground";
  } else if (variant === "outline") {
    baseClasses +=
      " border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground";
  }

  if (size === "default") {
    baseClasses += " h-9 px-4 py-2";
  } else if (size === "sm") {
    baseClasses += " h-8 px-3 text-xs";
  } else if (size === "icon") {
    baseClasses += " h-9 w-9";
  }

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Avatar = ({ children, className, ...props }: AvatarProps) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  >
    {children}
  </div>
);

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = ({ className, ...props }: AvatarImageProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className={`aspect-square h-full w-full ${className}`}
    alt=""
    {...props}
  />
);

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

const AvatarFallback = ({
  children,
  className,
  ...props
}: AvatarFallbackProps) => (
  <span
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
    {...props}
  >
    {children}
  </span>
);

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const Separator = ({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) => (
  <div
    className={`shrink-0 bg-border ${
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
    } ${className}`}
    {...props}
  />
);

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  children: React.ReactNode;
}

const Tabs = ({ children, ...props }: TabsProps) => (
  <div {...props}>{children}</div>
);

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const TabsContent = ({ children, ...props }: TabsContentProps) => (
  <div {...props}>{children}</div>
);

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Table = ({ children, className, ...props }: TableProps) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
      {children}
    </table>
  </div>
);

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableHeader = ({ children, className, ...props }: TableHeaderProps) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props}>
    {children}
  </thead>
);

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody = ({ children, className, ...props }: TableBodyProps) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props}>
    {children}
  </tbody>
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

const TableRow = ({ children, className, ...props }: TableRowProps) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
    {...props}
  >
    {children}
  </tr>
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableHead = ({ children, className, ...props }: TableHeadProps) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  >
    {children}
  </th>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableCell = ({ children, className, ...props }: TableCellProps) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
    {...props}
  >
    {children}
  </td>
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Badge = ({ children, className, ...props }: BadgeProps) => (
  <div
    className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Dummy PageLoader component
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
  </div>
);

// Dummy data types
interface WalletRes {
  balance: number;
}

interface Transaction {
  id: string;
  payment_type: "wallet" | "expense";
  mollie_data: {
    description: string;
  };
  mollie_payment_id: string;
  paid_at: string;
  amount: number;
  status: string;
}

const ErrorComp = ({ message }: { message: string }) => {
  return (
    <>
      <p className="flex-1 col-span-3 py-20 w-full text-sm text-center text-red-500 border-2">
        {message}
      </p>
    </>
  );
};

export default function WalletPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [walletData, setWalletData] = useState<WalletRes>();
  const [walletHistory, setWalletHistory] = useState<Transaction[] | []>();
  const [walletHistoryLoader, setWalletHistoryLoader] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [addMoneyModal, setAddMoneyModal] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations("WalletPage");
  
  // Use real user data with the same pattern as Profile component
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const wallet = {
    balance: walletData?.balance || 0,
    currency: "EUR",
    status: t("status.active"),
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case t("status.active").toLowerCase():
        return "bg-green-100 text-green-800";
      case t("status.pending").toLowerCase():
        return "bg-yellow-100 text-yellow-800";
      case t("status.paid").toLowerCase():
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Check token validity
  useEffect(() => {
    const token = tokenUtils.getToken();
    if (token) {
      // Simple token validation - check if it's a valid JWT format
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1]));
          const now = Math.floor(Date.now() / 1000);
          setTokenValid(payload.exp > now);
        } catch (e) {
          setTokenValid(false);
        }
      } else {
        setTokenValid(false);
      }
    } else {
      setTokenValid(false);
    }
  }, []);

  // Fetch user data using the same pattern as Profile component
  useEffect(() => {
    const handleUserDataUpdate = (event: CustomEvent) => {
      const userData = event.detail;
      if (userData && userData.email && userData.email !== "user@example.com") {
        setUser(userData);
        setUserLoading(false);
      }
    };

    window.addEventListener(
      "userDataUpdated",
      handleUserDataUpdate as EventListener
    );

    const fetchUserData = () => {
      try {
        const userData = tokenUtils.getUser();
        console.log("Wallet: Fetched user data:", userData);
        if (
          userData &&
          userData.email &&
          userData.email !== "user@example.com"
        ) {
          setUser(userData);
          setUserLoading(false);
          return true;
        }
        console.log("Wallet: User data validation failed:", {
          hasUserData: !!userData,
          email: userData?.email,
          isValidEmail: userData?.email !== "user@example.com"
        });
        return false;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return false;
      }
    };

    // Try to load user data immediately
    if (!fetchUserData()) {
      // If no user data found, retry with exponential backoff
      let retryCount = 0;
      const maxRetries = 15;

      const retryInterval = setInterval(() => {
        retryCount++;
        if (fetchUserData() || retryCount >= maxRetries) {
          if (retryCount >= maxRetries) {
            setUserLoading(false);
          }
          clearInterval(retryInterval);
        }
      }, 200 * retryCount); // Exponential backoff

      return () => {
        window.removeEventListener(
          "userDataUpdated",
          handleUserDataUpdate as EventListener
        );
        clearInterval(retryInterval);
      };
    }

    return () => {
      window.removeEventListener(
        "userDataUpdated",
        handleUserDataUpdate as EventListener
      );
    };
  }, []);

  // Fetch additional user profile data if needed
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !userProfile) {
        setUserProfileLoading(true);
        try {
          const token = tokenUtils.getToken();
          if (!token) {
            console.log("Wallet: No token available, skipping profile fetch");
            setUserProfileLoading(false);
            return;
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            }
          );

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.user || data);
            console.log("Wallet: Successfully fetched user profile:", data);
          } else if (response.status === 401) {
            console.log("Wallet: Unauthorized - token may be invalid or expired");
            // Don't show error, just use local user data
            setUserProfile(null);
          } else {
            console.error("Wallet: Failed to fetch user profile:", response.status);
            // Don't show error, just use local user data
            setUserProfile(null);
          }
        } catch (err) {
          console.error("Wallet: Error fetching user profile:", err);
          // Don't show error, just use local user data
          setUserProfile(null);
        } finally {
          setUserProfileLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user, userProfile]);

  // Fetch wallet balance from API
  useEffect(() => {
    const fetchWallet = async () => {
      setIsPageLoading(true);
      try {
        const token = tokenUtils.getToken();

        if (!token) {
          console.error("No authentication token found");
          setWalletData({ balance: 0 });
          setIsPageLoading(false);
          return;
        }

        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/wallet/balance`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        console.log("Wallet balance API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Wallet balance API response:", data);

          // Handle different possible response structures
          const balance = data.balance || data.data?.balance || 0;
          setWalletData({ balance });
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            "Failed to fetch wallet balance:",
            response.status,
            errorData
          );
          // Set default balance on error
          setWalletData({ balance: 0 });
        }
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
        // Set default balance on error - this will show the page with 0 balance
        setWalletData({ balance: 0 });
        setApiError(true);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchWallet();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      console.log("🔍 [WALLET TRANSACTIONS] Starting to fetch transactions...");
      setWalletHistoryLoader(true);
      try {
        const token = tokenUtils.getToken();
        console.log("🔑 [WALLET TRANSACTIONS] Token available:", !!token);
        console.log("🔑 [WALLET TRANSACTIONS] Token (first 20 chars):", token?.substring(0, 20) + "...");
        
        if (!token) {
          console.error("❌ [WALLET TRANSACTIONS] No token available for transactions");
          setWalletHistory([]);
          setWalletHistoryLoader(false);
          return;
        }

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/wallet/transactions?per_page=10`;
        console.log("🌐 [WALLET TRANSACTIONS] API URL:", url);
        console.log("🌐 [WALLET TRANSACTIONS] API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log("📡 [WALLET TRANSACTIONS] Response status:", response.status);
        console.log("📡 [WALLET TRANSACTIONS] Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ [WALLET TRANSACTIONS] Failed to fetch transactions:", response.status);
          console.error("❌ [WALLET TRANSACTIONS] Error response:", errorText);
          setWalletHistory([]);
          setWalletHistoryLoader(false);
          return;
        }

        const result = await response.json();
        console.log("📦 [WALLET TRANSACTIONS] Full API Response:", JSON.stringify(result, null, 2));
        console.log("✅ [WALLET TRANSACTIONS] Success:", result.success);
        console.log("📊 [WALLET TRANSACTIONS] Data exists:", !!result.data);
        console.log("📊 [WALLET TRANSACTIONS] Data is array:", Array.isArray(result.data));
        console.log("📊 [WALLET TRANSACTIONS] Data length:", result.data?.length || 0);
        
        if (result.success && result.data) {
          // Transform backend response to match frontend Transaction interface
          const transactions: Transaction[] = result.data.map((txn: any) => ({
            id: txn.id,
            payment_type: txn.payment_type?.toLowerCase().includes("expense") ? "expense" : "wallet",
            mollie_data: { 
              description: txn.mollie_data?.description || txn.plan_name || "Transaction" 
            },
            mollie_payment_id: txn.mollie_payment_id || txn.id,
            paid_at: txn.paid_at || txn.created_at || new Date().toISOString(),
            amount: parseFloat(txn.amount) || 0,
            status: txn.status || "pending",
          }));
          
          console.log("✅ [WALLET TRANSACTIONS] Transformed transactions:", transactions.length);
          console.log("📋 [WALLET TRANSACTIONS] Transactions details:", JSON.stringify(transactions, null, 2));
          
          setWalletHistory(transactions);
        } else {
          console.warn("⚠️ [WALLET TRANSACTIONS] No transactions found in response");
          console.warn("⚠️ [WALLET TRANSACTIONS] Result:", result);
          setWalletHistory([]);
        }
      } catch (error) {
        console.error("❌ [WALLET TRANSACTIONS] Error fetching transactions:", error);
        console.error("❌ [WALLET TRANSACTIONS] Error details:", error instanceof Error ? error.message : String(error));
        setWalletHistory([]);
      } finally {
        console.log("🏁 [WALLET TRANSACTIONS] Finished fetching. Loader off.");
        setWalletHistoryLoader(false);
      }
    };
    fetchTransactions();
  }, []);

  // Debug logging for transaction rendering
  console.log("🎨 [WALLET RENDER] walletHistory state:", walletHistory);
  console.log("🎨 [WALLET RENDER] walletHistory length:", walletHistory?.length);
  console.log("🎨 [WALLET RENDER] walletHistoryLoader:", walletHistoryLoader);
  console.log("🎨 [WALLET RENDER] isPageLoading:", isPageLoading);

  if (isPageLoading) {
    return <PageLoader />;
  }

  // If user is not authenticated, show error
  if (!userLoading && !user) {
    return (
      <div className="p-4 min-h-screen md:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">Please sign in to access your wallet.</p>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600">Debug: Token available: {tokenUtils.getToken() ? "Yes" : "No"}</p>
              <p className="text-sm text-gray-600">Debug: User loading: {userLoading ? "Yes" : "No"}</p>
            </div>
            <button
              onClick={() => router.push('/signin')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen md:p-6">
      <div className="mx-auto space-y-6 max-w-6xl">

        {/* Token Invalid Banner */}
        {tokenValid === false && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Token Invalid
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Your authentication token is invalid or expired. Please sign in again.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Error Banner */}
        {apiError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  API Connection Issue
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Unable to connect to the backend server. Showing demo data. Please check your API configuration.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Wallet</h1>
            <p className="text-muted-foreground">
              Manage your transactions and balance
            </p>
          </div>
        </div>

        {/* User Info & Balance Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userLoading || userProfileLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-48"></div>
                  </div>
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={userProfile?.profile_picture || user.profile_picture || "/Image-1.png"}
                        alt={userProfile?.name || user.name}
                      />
                      <AvatarFallback>
                        {(() => {
                          const name = userProfile?.name || user.name;
                          return name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || "U";
                        })()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userProfile?.name || user.name || "User"}</p>
                      <p className="text-sm text-muted-foreground">{userProfile?.email || user.email || "user@example.com"}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Member Since</span>
                      <span>
                        {(userProfile?.created_at || user.created_at)
                          ? new Date(userProfile?.created_at || user.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })
                          : "N/A"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Account Type</span>
                      <span className="capitalize">{userProfile?.role?.name || user.role?.name || "client"}</span>
                    </div>
                    {userProfile?.phone && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phone</span>
                        <span>{userProfile.phone}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-red-500">Error Loading User</p>
                  <p className="text-xs text-muted-foreground">Please refresh the page</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Balance Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Current Balance</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                >
                  {balanceVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {balanceVisible
                      ? formatCurrency(wallet.balance, wallet.currency)
                      : "••••••"}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Available Balance
                  </p>
                </div>
                <div className="flex gap-4 justify-center items-center text-sm">
                  <div className="flex gap-1 items-center">
                    <Euro className="w-4 h-4 text-green-600" />
                    <span>{wallet.currency}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <span>Digital Wallet</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Money Management Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Euro className="w-5 h-5 text-blue-600" />
                  Add Money
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <Button
                    onClick={() => setAddMoneyModal(true)}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="mr-2 w-5 h-5" />
                    Add Money
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallet History */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <CardTitle>Your Transactions</CardTitle>
                <CardDescription>Latest activity</CardDescription>
              </div>
            </div>
          </CardHeader>
          {walletHistory ? (
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsContent value="all" className="mt-4">
                  {walletHistory?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {walletHistory.map((transaction) => (
                          <TableRow
                            key={transaction.id}
                            className="hover:bg-slate-200"
                          >
                            <TableCell>
                              <div className="flex gap-3 items-center">
                                <div
                                  className={`p-2 rounded-full ${
                                    transaction.payment_type === "wallet"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-red-100 text-red-600"
                                  }`}
                                >
                                  {transaction.payment_type === "wallet" ? (
                                    <ArrowDownLeft className="w-4 h-4" />
                                  ) : (
                                    <ArrowUpRight className="w-4 h-4" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {transaction.mollie_data.description}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {transaction.mollie_payment_id}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {new Date(
                                    transaction.paid_at
                                  ).toLocaleDateString("en-GB")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(
                                    transaction.paid_at
                                  ).toLocaleTimeString("en-GB")}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`font-medium ${
                                  transaction.payment_type === "wallet"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.payment_type === "wallet"
                                  ? "+"
                                  : "-"}
                                {formatCurrency(transaction.amount, "EUR")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(transaction.status)}
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/dashboard/account/invoice/${transaction.id}`
                                    );
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <FileText className="w-4 h-4" />
                                  View
                                </Button>
                                {/* <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      `/invoice/${transaction.id}`,
                                      "_blank"
                                    );
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="w-4 h-4" />
                                  Download PDF
                                </Button> */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <ErrorComp message="No transactions found." />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          ) : (
            <div>
              {walletHistoryLoader ? (
                <div className="py-20">
                  {" "}
                  <Loader2 className="mx-auto animate-spin w-6 h-6 text-blue-500" />
                </div>
              ) : (
                <ErrorComp message="Error Fetching wallet History" />
              )}
            </div>
          )}
        </Card>
      </div>
      {addMoneyModal && (
        <AddMoney handleClose={() => setAddMoneyModal(false)} />
      )}
    </div>
  );
}
