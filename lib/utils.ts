import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { Tables } from "@/database.types";
import { jsPDF } from "jspdf";
import logoBase64 from "@/app/logoBase64";

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

export const GenerateRecieptToPDF = (item: OrdersT) => {
  const doc = new jsPDF();

  // Add the image as a background, centered
  const logoWidth = 100; // Width of the logo
  const logoHeight = 100; // Height of the logo
  const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Centered X position
  const logoY = 20; // Y position
  doc.addImage(
    logoBase64,
    "PNG",
    logoX,
    logoY,
    logoWidth,
    logoHeight,
    "",
    "FAST"
  );

  // Set font size and style for the main title
  doc.setFontSize(22);
  const titleY = logoY + logoHeight + 10; // Position below the logo
  doc.text(
    "Scan QR-Code to track your laundry status.",
    doc.internal.pageSize.getWidth() / 2,
    titleY,
    { align: "center" }
  );

  // Reset font size and explicitly set font style for normal text
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal"); // Set to "helvetica" or any standard font
  const detailsStartY = titleY + 30;

  // Add order details
  doc.text(`Name: ${item.customer_id.name}`, 10, detailsStartY);
  doc.text(`Kilograms: ${item.kilograms + "kg"}`, 10, detailsStartY + 10);
  doc.text(`Total price: ${item.price}`, 10, detailsStartY + 20);
  doc.text(`Tracking Number: ${item.tracking_number}`, 10, detailsStartY + 30);

  // Set font size and style for person details
  doc.setFontSize(22);

  // Save the PDF
  doc.save(`${item.customer_id.name}-receipt.pdf`);
};
