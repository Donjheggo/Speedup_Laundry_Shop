import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
