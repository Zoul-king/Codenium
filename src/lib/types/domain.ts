export type Role = "client" | "pm" | "admin";

export type PermissionKey =
  | "quotes:read"
  | "quotes:write"
  | "projects:read"
  | "projects:write"
  | "messages:read"
  | "messages:write"
  | "users:read"
  | "users:write"
  | "settings:read";

export type QuoteProjectType =
  | "landing"
  | "corporate"
  | "ecommerce"
  | "admin-system"
  | "web-app"
  | "automation"
  | "redesign";

export type QuoteModuleKey =
  | "custom-design"
  | "admin-panel"
  | "auth"
  | "roles"
  | "blog"
  | "catalog"
  | "payments"
  | "multilang"
  | "integrations"
  | "reports"
  | "notifications"
  | "chat"
  | "maintenance";

export type QuoteStatus = "draft" | "sent" | "review" | "approved";

export type ProjectStatus = "discovery" | "design" | "build" | "qa" | "done";

export type MessageStatus = "unread" | "read";

export interface EstimateRange {
  min: number;
  max: number;
}

export interface QuoteProjectTypeOption {
  key: QuoteProjectType;
  label: string;
  description: string;
  base: EstimateRange;
  timelineWeeks: EstimateRange;
}

export interface QuoteModuleOption {
  key: QuoteModuleKey;
  group: "feature" | "service";
  label: string;
  description: string;
  price: EstimateRange;
  timelineWeeks?: EstimateRange;
  monthly?: EstimateRange;
}

export interface QuoteDraft {
  projectType: QuoteProjectType;
  modules: QuoteModuleKey[];
}

export interface QuoteEstimate {
  build: EstimateRange;
  monthly: EstimateRange;
  timelineWeeks: EstimateRange;
}

export interface QuoteContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export interface QuoteRecord {
  id: string;
  code: string;
  title: string;
  role: Role;
  status: QuoteStatus;
  createdAt: string;
  projectType: QuoteProjectType;
  modules: QuoteModuleKey[];
  estimate: QuoteEstimate;
}

export interface ProjectRecord {
  id: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  progress: number;
  dueDate: string;
  pmId: string;
  quoteCode: string;
  summary: string;
}

export interface MessageRecord {
  id: string;
  thread: string;
  senderName: string;
  role: Role;
  preview: string;
  sentAt: string;
  status: MessageStatus;
}

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role: Role;
  title: string;
  activeProjects: number;
}

export interface AuthAccountRecord {
  userId: string;
  email: string;
  password: string;
  role: Role;
}

export interface MockSession {
  userId: string;
  role: Role;
  name: string;
  email: string;
  permissions: PermissionKey[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface DashboardNavItem {
  key: string;
  label: string;
  href: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  helper: string;
}
