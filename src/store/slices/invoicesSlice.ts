import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Invoice } from "../../types";

interface InvoicesState {
  items: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  items: [],
  loading: false,
  error: null,
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.items = action.payload;
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.items.push(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setInvoices, addInvoice, updateInvoice, setLoading, setError } =
  invoicesSlice.actions;
export default invoicesSlice.reducer;
