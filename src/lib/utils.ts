import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate some initial mock data using local storage so the app is fully functional client-side.
export const generateId = () => Math.random().toString(36).substring(2, 9);
