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
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold ${className}`}
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

// Data types
interface WalletRes {
  balance: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [walletHistory, setWalletHistory] = useState<Transaction[] | []>();
  const [walletHistoryLoader, setWalletHistoryLoader] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [addMoneyModal, setAddMoneyModal] = useState<boolean>(false);

  const [user, setUser] = useState("");
  const router = useRouter();
  const t = useTranslations("WalletPage");

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
    // Format to 2 decimal places without comma separators
    const formattedAmount = amount.toFixed(2);

    // Add currency symbol
    if (currency === "EUR") {
      return `€ ${formattedAmount}`;
    } else if (currency === "USD") {
      return `$ ${formattedAmount}`;
    } else {
      return `${currency} ${formattedAmount}`;
    }
  };

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        if (!token) {
          console.error("No authentication token found");
          // Set fallback user data when no token
          setUserProfile({
            id: "fallback",
            name: "Guest User",
            email: "guest@example.com",
          });
          return;
        }

        console.log(
          "Fetching profile with token:",
          token ? "Token exists" : "No token"
        );
        console.log(
          "API URL:",
          "https://answer24.laravel.cloud/api/v1/profile"
        );

        const response = await fetch(
          "https://answer24.laravel.cloud/api/v1/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("User profile API response status:", response.status);
        console.log("User profile API response headers:", response.headers);

        // Get response text first to see what we're actually receiving
        const responseText = await response.text();
        console.log("Raw response text:", responseText);

        if (response.ok) {
          try {
            const data = JSON.parse(responseText);
            console.log("User profile API response data:", data);

            // Handle different possible response structures
            const profile = data.data || data.user || data;
            console.log("Parsed profile:", profile);
            setUserProfile(profile);
          } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            console.log("Response was:", responseText);

            // Set fallback user data on parse error
            setUserProfile({
              id: "parse-error",
              name: "Parse Error",
              email: "parse@example.com",
            });
          }
        } else {
          console.error(
            "Failed to fetch user profile:",
            response.status,
            response.statusText,
            "Response:",
            responseText
          );

          // Set fallback user data on error
          setUserProfile({
            id: "error",
            name: "Error Loading User",
            email: "error@example.com",
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);

        // Set fallback user data on network error
        setUserProfile({
          id: "network-error",
          name: "Network Error",
          email: "network@example.com",
        });
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch wallet balance from API
  useEffect(() => {
    const fetchWallet = async () => {
      setIsPageLoading(true);
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        if (!token) {
          console.error("No authentication token found");
          setIsPageLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/wallet/balance`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Wallet balance API response status:", response.status);

        // Get response text first to see what we're actually receiving
        const responseText = await response.text();
        console.log("Raw wallet response text:", responseText);

        if (response.ok) {
          try {
            const data = JSON.parse(responseText);
            console.log("Wallet balance API response:", data);

            // Handle different possible response structures
            const balance = data.balance || data.data?.balance || 0;
            setWalletData({ balance });
          } catch (parseError) {
            console.error("Error parsing wallet JSON response:", parseError);
            console.log("Wallet response was:", responseText);
            // Set default balance on parse error
            setWalletData({ balance: 0 });
          }
        } else {
          console.error(
            "Failed to fetch wallet balance:",
            response.status,
            response.statusText,
            "Response:",
            responseText
          );
          // Set default balance on error
          setWalletData({ balance: 0 });
        }
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
        // Set default balance on error
        setWalletData({ balance: 0 });
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchWallet();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setWalletHistoryLoader(true);

      const token = tokenUtils.getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/wallet/transactions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setWalletHistory([]);
      setWalletHistoryLoader(false);

      /* COMMENTED OUT MOCK DATA - UNCOMMENT WHEN API IS READY
      const dummyTransactions: Transaction[] = [
        {
          id: "txn_001",
          payment_type: "wallet",
          mollie_data: { description: t("transactionTypes.wallet") },
          mollie_payment_id: "tr_abc123",
          paid_at: new Date().toISOString(),
          amount: 100,
          status: t("status.paid"),
        },
        {
          id: "txn_002",
          payment_type: "expense",
          mollie_data: { description: t("transactionTypes.expense") },
          mollie_payment_id: "tr_def456",
          paid_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 45.5,
          status: t("status.pending"),
        },
        {
          id: "txn_003",
          payment_type: "wallet",
          mollie_data: { description: t("transactionTypes.wallet") },
          mollie_payment_id: "tr_ghi789",
          paid_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 20.0,
          status: t("status.active"),
        },
        {
          id: "txn_004",
          payment_type: "expense",
          mollie_data: { description: t("transactionTypes.expense") },
          mollie_payment_id: "tr_jkl012",
          paid_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 15.0,
          status: t("status.paid"),
        },
        {
          id: "txn_005",
          payment_type: "wallet",
          mollie_data: { description: t("transactionTypes.wallet") },
          mollie_payment_id: "tr_mno345",
          paid_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 50.0,
          status: t("status.paid"),
        },
      ];
      setWalletHistory(dummyTransactions);
      */
    };
    fetchTransactions();
  }, []);

  if (isPageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="p-4 min-h-screen md:p-6">
      <div className="mx-auto space-y-6 max-w-6xl">
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
              {userProfile ? (
                <>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      {userProfile.avatar ? (
                        <AvatarImage
                          src={userProfile.avatar}
                          alt={userProfile.name}
                          onError={(e) => {
                            // Hide the image if it fails to load
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                      <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold text-lg">
                        {userProfile.name
                          ? userProfile.name.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userProfile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.email}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Member Since
                      </span>
                      <span>{formatJoinDate(userProfile.created_at)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading profile...
                  </span>
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
