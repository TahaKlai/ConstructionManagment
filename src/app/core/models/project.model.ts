export interface Project {
  id?: number;
  name: string;
  description: string;
  location: string;
  clientName: string;
  clientContact: string;
  startDate: string;
  endDate: string;
  status: string;
  totalBudget: number;
  budgetLines?: BudgetLine[];
  tasks?: Task[];
  amendments?: Amendment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetLine {
  id?: number;
  projectId?: number;
  code: string;
  description: string;
  amount: number;
  dueDate?: string;
  remarks?: string;
}

export interface Task {
  id?: number;
  name: string;
  description?: string;
  wbsCode?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  completionPercentage?: number;
  status?: string;
  milestone?: boolean;
  duration?: number;
  project?: Project;
  parent?: Task;
  subtasks?: Task[];
  projectId?: number;
  parentId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Amendment {
  id?: number;
  projectId?: number;
  title: string;
  value: number;
  budgetedCost: number;
  deliveryExtension: number;
  description?: string;
  status?: string;
  createdAt?: string;
}

export interface PaymentTerm {
  id?: number;
  projectId?: number;
  description: string;
  amount: number;
  dueDate: string;
  status?: string;
}

export interface WorkedHour {
  id?: number;
  date: string;
  hours: number;
  workerName: string;
  description?: string;
  weekNumber?: number;
  year?: number;
  task?: Task;
  taskId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id?: number;
  invoiceNumber?: string;
  invoiceDate: string;
  amount: number;
  description: string;
  status: string;
  dueDate?: string;
  paidDate?: string;
  supplier?: Supplier;
  budgetLine?: BudgetLine;
  supplierId?: number;
  budgetLineId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetLine {
  id?: number;
  code: string;
  description: string;
  budgetAmount: number;
  spentAmount?: number;
}

export interface Supplier {
  id?: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  category?: string;
  invoices?: Invoice[];
  createdAt?: string;
  updatedAt?: string;
}