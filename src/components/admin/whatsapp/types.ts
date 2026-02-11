export interface QueueItem {
  id: number;
  phone: string;
  message_text: string;
  message_template: string;
  scheduled_at: string;
  sent_at: string | null;
  status: string;
  lead_phone: string;
  lead_name: string;
  course: string;
  error_message?: string | null;
  lead_id: number;
}

export interface Template {
  id: number;
  name: string;
  title: string;
  content: string;
  delay_days: number;
  course: string | null;
  active: boolean;
  file_url?: string | null;
  file_type?: string | null;
  file_name?: string | null;
}

export interface Stats {
  stats: Array<{ status: string; count: number }>;
  active_campaigns: number;
}