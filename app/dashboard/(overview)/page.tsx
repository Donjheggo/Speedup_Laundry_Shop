import DashboardCard from "@/components/dashboard/dashboard-card";
import { LoaderPinwheel, Hand, Check, PhilippinePeso } from "lucide-react";
import OrdersTable from "@/components/dashboard/orders-table";
import CustomersTable from "@/components/dashboard/customers-table";
import {
  TotalClaimedOrders,
  TotalOnProcessOrders,
  TotalPickUpOrders,
  GetTodaysIncome,
} from "@/lib/actions/orders";

export default async function Dashboard() {
  const [todays_income, claimed, process, pickup] = await Promise.all([
    GetTodaysIncome(),
    TotalClaimedOrders(),
    TotalOnProcessOrders(),
    TotalPickUpOrders(),
  ]);

  const cards = [
    {
      title: "Today's Income",
      number: todays_income,
      icon: <PhilippinePeso size={18} className="text-primary" />,
    },
    {
      title: "On Process Orders",
      number: process,
      icon: <LoaderPinwheel size={18} className="text-primary" />,
    },
    {
      title: "Ready For Pickup",
      number: pickup,
      icon: <Hand size={18} className="text-primary" />,
    },
    {
      title: "Claimed Orders",
      number: claimed,
      icon: <Check size={18} className="text-primary" />,
    },
  ];

  return (
    <div className="container mx-auto max-w-screen-2xl">
      <h1 className="text-center text-2xl">Dashboard</h1>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 xl:grid-cols-4 mt-4">
        {cards.map((item, index) => (
          <DashboardCard key={index} item={item} />
        ))}
      </div>
      <div className="flex flex-1 flex-col lg:flex-row gap-4 mt-4">
        <div className="w-full">
          <OrdersTable searchQuery="" page={1} />
        </div>
        <div className="w-full lg:w-[50%]">
          <CustomersTable searchQuery="" page={1} />
        </div>
      </div>
    </div>
  );
}
