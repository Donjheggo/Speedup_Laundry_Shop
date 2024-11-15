import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { Tables } from "@/database.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FormatDateTime = (date: Date) => {
  return `${date.toLocaleTimeString()} - ${date.toDateString()}`;
};

// Utility function to generate random string of specified length
const GenerateRandomString = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

// Generate tracking number with format: PREFIX-TIMESTAMP-RANDOM
export const GenerateTrackingNumber = (): string => {
  const prefix = "TRK"; // You can customize this prefix
  const timestamp = Date.now().toString(36).toUpperCase(); // Convert timestamp to base36
  const randomPart = GenerateRandomString(4); // 4 random characters

  return `${prefix}-${timestamp}-${randomPart}`;
};

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

export const ExportOrdersToExcel = (data: OrdersT[]) => {
  const exportData = data.map((item) => ({
    Name: item.customer_id.name,
    Kilograms: item.kilograms + "kg",
    Price: "₱" + item.price,
    "Tracking Number": item.tracking_number,
    Status: item.status,
    "Created At": `${new Date(item.created_at).toLocaleDateString()}`,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  XLSX.writeFile(workbook, "orders.xlsx");
};

export const ExportCustomersToExcel = (data: CustomerT[]) => {
  const exportData = data.map((item) => ({
    Name: item.name,
    "Contact Number": item.contact_number,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
  XLSX.writeFile(workbook, "customers.xlsx");
};
