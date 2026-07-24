export interface Unit {
  id: string;
  name: string;
  isProtected: boolean;
  requiredFields?: string[];
  createdAt: string;
}