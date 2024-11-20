// Add new interfaces
export interface BusinessDetails {
  name: string;
  address: string;
  gst_number: string;
  contact: string;
}

export interface TaxDetails {
  igst_percentage?: number;
  igst_amount?: number;
  cgst_percentage?: number;
  cgst_amount?: number;
  sgst_percentage?: number;
  sgst_amount?: number;
}

// Update existing interfaces
export interface Invoice {
  id: string;
  serialNumber: string;
  customerName: string;
  customerGst?: string;
  productName: string;
  quantity: number;
  tax: number;
  totalAmount: number;
  date: string;
  discount?: number;
  businessDetails?: BusinessDetails;
  taxDetails?: TaxDetails;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  priceWithTax: number;
  discount: number;
  discountPercentage?: number;
}

export interface RootState {
  invoices: InvoiceState;
  products: ProductState;
  customers: CustomerState;
  ui: UIState;
}

export interface InvoiceState {
  items: Invoice[];
  loading: boolean;
  error: string | null;
}

export interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export interface CustomerState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

export interface UIState {
  notifications: Notification[];
  activeTab: string;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}
