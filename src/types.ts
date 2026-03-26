export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  exp: number;
  maxExp: number;
}

export type ViewType =
  | "home"
  | "learning"
  | "parent"
  | "awards"
  | "shop"
  | "profile"
  | "settings"
  | "subscriptions"
  | "reports"
  | "report-generator"
  | "edit-profile";

export interface Achievement {
  id: string;
  name: string;
  intro: string;
  iconBg: string;
  iconColor: string;
  IconComponent: any;
  acquired: boolean;
}

export interface Subscription {
  id: number;
  name: string;
  desc: string;
  status: string;
  expireDate: string;
  image: string;
}
