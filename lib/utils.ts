import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  if (secondsAgo < 60) return '刚刚';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} 分钟前`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} 小时前`;
  if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 86400)} 天前`;
  if (secondsAgo < 31536000) return `${Math.floor(secondsAgo / 2592000)} 个月前`;
  return `${Math.floor(secondsAgo / 31536000)} 年前`;
}