export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  iq_score: number;
  deal_type: 'Fix & Flip' | 'BRRRR' | 'Both';
  description: string;
  images: string[];
  created_at: string;
  user_id: string;
  profiles?: {
    name: string;
    avatar_url: string | null;
  };
}

export interface DealAnalysis {
  purchase_price: number;
  rehab_cost: number;
  arv: number;
  holding_costs: number;
  roi: number;
}

export interface AdvisorRequest {
  id: string;
  property_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  response?: string;
  created_at: string;
  responded_at?: string;
  advisor_id?: string;
  properties?: Property;
  profiles?: User;
}