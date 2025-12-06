import { SaleRecord, AppSettings, SalesGoal, DailyTask, StoreProfile, ExpenseRecord, InventoryRecord } from '../types';

const STORAGE_KEY = 'therrabiz_sales_data';
const PROFILE_KEY = 'therrabiz_profile';
const SETTINGS_KEY = 'therrabiz_settings';
const GOALS_KEY = 'therrabiz_goals';
const TASKS_KEY = 'therrabiz_tasks';
const EXPENSES_KEY = 'therrabiz_expenses';
const INVENTORY_KEY = 'therrabiz_inventory';

// Event constant for real-time updates
export const SALES_UPDATE_EVENT = 'therrabiz_sales_updated';
export const EXPENSE_UPDATE_EVENT = 'therrabiz_expenses_updated';

// --- Sales Data Logic ---

export const getSalesData = (): SaleRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load data", error);
    return [];
  }
};

export const saveSalesData = (data: SaleRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(SALES_UPDATE_EVENT));
  } catch (error) {
    console.error("Failed to save data", error);
  }
};

export const addSaleRecord = (record: SaleRecord) => {
  const current = getSalesData();
  const updated = [...current, record];
  saveSalesData(updated);
  return updated;
};

export const updateSaleRecord = (updatedRecord: SaleRecord) => {
  const current = getSalesData();
  const updated = current.map(item => item.id === updatedRecord.id ? updatedRecord : item);
  saveSalesData(updated);
  return updated;
};

export const deleteSaleRecord = (id: string) => {
  const current = getSalesData();
  const updated = current.filter(item => String(item.id) !== String(id));
  saveSalesData(updated);
  return updated;
};

// Removed automatic seeding to ensure dashboard starts empty as requested
export const seedDataIfEmpty = () => {
  // Intentionally left empty.
  // We want the user to start with 0 data.
};

// --- Store Profile Logic ---

export const saveStoreProfile = (profile: StoreProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getStoreProfile = (): StoreProfile => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : { ownerName: 'Owner', storeName: 'My UMKM' };
  } catch {
    return { ownerName: 'Owner', storeName: 'My UMKM' };
  }
};

export const getUserName = (): string => {
  return getStoreProfile().ownerName;
};

export const clearSession = () => {
  // We keep the data, but maybe clear session flags if needed.
};

// --- Settings Logic ---

export const getAppSettings = (): AppSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { theme: 'dark', layout: 'modern', analyticsMode: 'basic' };
  } catch {
    return { theme: 'dark', layout: 'modern', analyticsMode: 'basic' };
  }
};

export const saveAppSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Goals Logic ---

export const getSalesGoals = (): SalesGoal[] => {
  try {
    const data = localStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSalesGoal = (goal: SalesGoal) => {
  const current = getSalesGoals();
  const existingIndex = current.findIndex(g => g.month === goal.month);
  
  let updated;
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = goal;
  } else {
    updated = [...current, goal];
  }
  
  localStorage.setItem(GOALS_KEY, JSON.stringify(updated));
  return updated;
};

// --- Tasks Logic ---

export const getDailyTasks = (): DailyTask[] => {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveDailyTasks = (tasks: DailyTask[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// --- Expenses Logic ---

export const getExpenses = (): ExpenseRecord[] => {
  try {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addExpense = (expense: ExpenseRecord) => {
  const current = getExpenses();
  const updated = [...current, expense];
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(EXPENSE_UPDATE_EVENT));
  return updated;
};

// --- Inventory Logic ---

export const getInventoryRecords = (): InventoryRecord[] => {
  try {
    const data = localStorage.getItem(INVENTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveInventoryRecord = (record: InventoryRecord) => {
  const current = getInventoryRecords();
  const updated = [...current, record];
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(updated));
  return updated;
};