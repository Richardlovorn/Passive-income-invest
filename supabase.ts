import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - these values are provided by the system
const supabaseUrl = 'https://cwzdndnhwvmffuujhdng.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3emRuZG5od3ZtZmZ1dWpoZG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTc2OTIsImV4cCI6MjA3NDI3MzY5Mn0.Ov-Jj2jKqJHuWo8Q7_Vt0cFGMVLnKGP7HBPqcUZBvSI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for income streams
export interface IncomeStream {
  id?: string;
  user_id: string;
  source: string;
  monthly_amount: number;
  automation_percentage: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Database types for transactions
export interface Transaction {
  id?: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  source: string;
  created_at?: string;
}

// Database types for user profiles
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  cash_app_handle?: string;
  alpaca_account_id?: string;
  profit_distribution_percentage?: number;
  created_at?: string;
  updated_at?: string;
}