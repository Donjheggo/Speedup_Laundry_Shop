"use client";

import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { ExportOrdersToExcel } from "@/lib/utils";
import { Tables } from "@/database.types";

export default function ExportToExcelButton({
  orders,
}: {
  orders: OrdersT[];
}) {
  return (
    <Button
      variant="default"
      className="flex items-center"
      onClick={() => ExportOrdersToExcel(orders)}
    >
      <File size={18} className="mr-2" /> Export
    </Button>
  );
}

type CustomerT = Tables<"customers">;
type OrdersT = {
  created_at: string;
  customer_id: CustomerT;
  id: string;
  kilograms: number;
  price: number;
  status: "ON PROCESS" | "READY FOR PICKUP" | "CLAIMED";
  tracking_number: string;
};
