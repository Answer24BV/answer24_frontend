import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="">{children}</main>
    </div>
  );
}