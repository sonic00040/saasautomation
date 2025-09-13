export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          email: string
          telegram_bot_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          telegram_bot_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          telegram_bot_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bots: {
        Row: {
          id: string
          user_id: string
          company_id: string
          name: string
          platform: 'telegram' | 'whatsapp' | 'discord'
          token: string | null
          webhook_url: string | null
          is_active: boolean
          last_activity: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id: string
          name: string
          platform: 'telegram' | 'whatsapp' | 'discord'
          token?: string | null
          webhook_url?: string | null
          is_active?: boolean
          last_activity?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string
          name?: string
          platform?: 'telegram' | 'whatsapp' | 'discord'
          token?: string | null
          webhook_url?: string | null
          is_active?: boolean
          last_activity?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          bot_id: string
          user_chat_id: string
          platform: 'telegram' | 'whatsapp' | 'discord'
          message_count: number
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bot_id: string
          user_chat_id: string
          platform: 'telegram' | 'whatsapp' | 'discord'
          message_count?: number
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bot_id?: string
          user_chat_id?: string
          platform?: 'telegram' | 'whatsapp' | 'discord'
          message_count?: number
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          company_id: string
          type: 'message' | 'bot_response' | 'user_join' | 'user_leave' | 'bot_created' | 'knowledge_updated'
          description: string
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id: string
          type: 'message' | 'bot_response' | 'user_join' | 'user_leave' | 'bot_created' | 'knowledge_updated'
          description: string
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string
          type?: 'message' | 'bot_response' | 'user_join' | 'user_leave' | 'bot_created' | 'knowledge_updated'
          description?: string
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          price: number
          token_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          token_limit: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          token_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          company_id: string
          plan_id: string
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
          updated_at: string
          plan?: Database['public']['Tables']['plans']['Row']
        }
        Insert: {
          id?: string
          company_id: string
          plan_id: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          plan_id?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usage_logs: {
        Row: {
          id: string
          subscription_id: string
          total_tokens: number
          created_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          total_tokens: number
          created_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          total_tokens?: number
          created_at?: string
        }
      }
      knowledge_bases: {
        Row: {
          id: string
          company_id: string
          content: string
          title?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          content: string
          title?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          content?: string
          title?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_total_usage: {
        Args: {
          p_subscription_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: number
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Company = Tables<'companies'>
export type Bot = Tables<'bots'>
export type Conversation = Tables<'conversations'>
export type Activity = Tables<'activities'>
export type Plan = Tables<'plans'>
export type Subscription = Tables<'subscriptions'>
export type UsageLog = Tables<'usage_logs'>
export type KnowledgeBase = Tables<'knowledge_bases'>