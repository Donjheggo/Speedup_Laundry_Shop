"use client";

import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { ExportCustomersToExcel } from "@/lib/utils";
import type { CustomersT } from "./update-form";

export default function ExportToExcelButton({
  customers,
}: {
  customers: CustomersT[];
}) {
  return (
    <Button
      variant="default"
      className="flex items-center"
      onClick={() => ExportCustomersToExcel(customers)}
    >
      <File size={18} className="mr-2" /> Export
    </Button>
  );
}
