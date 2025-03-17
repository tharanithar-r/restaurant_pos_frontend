import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface TableData {
  TableNo: string;
  TableStatus: string | null;
  NoOfGuests: number;
  WaiterName: string | null;
}

export interface TableState {
  currentTable: string | null;
  currentGuestCount: number;
  tableList: TableData[];
}

const initialState: TableState = {
  currentTable: null,
  currentGuestCount: 0,
  tableList: [],
};

interface SetTablePayload {
  TableNo: string;
  GuestCount?: number;
}

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTable(state, action: PayloadAction<SetTablePayload | null>) {
      if (action.payload) {
        const { TableNo, GuestCount } = action.payload;
        state.currentTable = TableNo;
        if (GuestCount) {
          state.currentGuestCount = GuestCount;
        }
      }
    },
    setTableList(state, action: PayloadAction<TableData[]>) {
      state.tableList = action.payload.map((table) => ({
        ...table,
        GuestCount: table.NoOfGuests, // Map NoOfPrint to GuestCount
      }));
    },
  },
});

export const { setTable, setTableList } = tableSlice.actions;
export default tableSlice.reducer;

export const getCurrentTable = (state: RootState) => state.table.currentTable;
export const getCurrentGuestCount = (state: RootState) =>
  state.table.currentGuestCount;
export const getTableList = (state: RootState) => state.table.tableList;
export const getCurrentTableGuestCount = (state: RootState) => {
  const currentTable = state.table.currentTable;
  if (!currentTable) return 0;

  const table = state.table.tableList.find((t) => t.TableNo === currentTable);
  return table?.NoOfGuests || 0;
};
