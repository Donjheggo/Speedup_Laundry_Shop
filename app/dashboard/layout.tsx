import UserLayout from "@/components/layout/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
