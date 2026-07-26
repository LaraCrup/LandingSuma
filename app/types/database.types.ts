export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      benefits: {
        Row: {
          brand_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_code: string | null
          id: string
          image_url: string | null
          level: number | null
          rejection_reason: string | null
          status: string
          terms_conditions: string | null
          title: string
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_code?: string | null
          id?: string
          image_url?: string | null
          level?: number | null
          rejection_reason?: string | null
          status?: string
          terms_conditions?: string | null
          title: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_code?: string | null
          id?: string
          image_url?: string | null
          level?: number | null
          rejection_reason?: string | null
          status?: string
          terms_conditions?: string | null
          title?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beneficios_level_fkey"
            columns: ["level"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["level_number"]
          },
          {
            foreignKeyName: "benefits_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_users: {
        Row: {
          brand_id: string
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string
          user_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string
          user_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_users_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          image_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      communities: {
        Row: {
          created_at: string
          created_by: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_habit_logs: {
        Row: {
          community_habit_id: string
          completed: boolean
          created_at: string | null
          date: string
          id: string
          longest_streak: number
          progress_count: number
          streak: number
          user_id: string
        }
        Insert: {
          community_habit_id: string
          completed?: boolean
          created_at?: string | null
          date?: string
          id?: string
          longest_streak?: number
          progress_count?: number
          streak?: number
          user_id: string
        }
        Update: {
          community_habit_id?: string
          completed?: boolean
          created_at?: string | null
          date?: string
          id?: string
          longest_streak?: number
          progress_count?: number
          streak?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_habit_logs_community_habit_id_fkey"
            columns: ["community_habit_id"]
            isOneToOne: false
            referencedRelation: "community_habits"
            referencedColumns: ["id"]
          },
        ]
      }
      community_habits: {
        Row: {
          community_id: string
          created_at: string
          frequency_detail: Json | null
          frequency_option: string | null
          frequency_type: string
          goal_value: number
          icon: string
          id: string
          identity: string | null
          longest_streak: number
          name: string
          streak: number
          unit: string | null
        }
        Insert: {
          community_id: string
          created_at?: string
          frequency_detail?: Json | null
          frequency_option?: string | null
          frequency_type?: string
          goal_value?: number
          icon: string
          id?: string
          identity?: string | null
          longest_streak?: number
          name: string
          streak?: number
          unit?: string | null
        }
        Update: {
          community_id?: string
          created_at?: string
          frequency_detail?: Json | null
          frequency_option?: string | null
          frequency_type?: string
          goal_value?: number
          icon?: string
          id?: string
          identity?: string | null
          longest_streak?: number
          name?: string
          streak?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_habits_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_messages: {
        Row: {
          community_id: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          community_id: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          community_id?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_messages_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string | null
          id: string
          receiver_id: string
          sender_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          receiver_id: string
          sender_id: string
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          receiver_id?: string
          sender_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          completed: boolean | null
          created_at: string | null
          date: string
          habit_id: string | null
          id: string
          value: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          date: string
          habit_id?: string | null
          id?: string
          value?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          date?: string
          habit_id?: string | null
          id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string | null
          frequency_detail: Json | null
          frequency_option: string | null
          frequency_type: string | null
          goal_value: number | null
          icon: string | null
          id: string
          identity: string | null
          longest_streak: number | null
          name: string
          progress_count: number | null
          reminder_enabled: boolean | null
          streak: number | null
          streak_grace_used_month: string | null
          unit: string | null
          updated_at: string | null
          user_id: string | null
          when_where: string | null
        }
        Insert: {
          created_at?: string | null
          frequency_detail?: Json | null
          frequency_option?: string | null
          frequency_type?: string | null
          goal_value?: number | null
          icon?: string | null
          id?: string
          identity?: string | null
          longest_streak?: number | null
          name: string
          progress_count?: number | null
          reminder_enabled?: boolean | null
          streak?: number | null
          streak_grace_used_month?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
          when_where?: string | null
        }
        Update: {
          created_at?: string | null
          frequency_detail?: Json | null
          frequency_option?: string | null
          frequency_type?: string | null
          goal_value?: number | null
          icon?: string | null
          id?: string
          identity?: string | null
          longest_streak?: number | null
          name?: string
          progress_count?: number | null
          reminder_enabled?: boolean | null
          streak?: number | null
          streak_grace_used_month?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string | null
          when_where?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habits_streak_backup_20260701: {
        Row: {
          backed_up_at: string | null
          id: string | null
          longest_streak: number | null
          name: string | null
          streak: number | null
        }
        Insert: {
          backed_up_at?: string | null
          id?: string | null
          longest_streak?: number | null
          name?: string | null
          streak?: number | null
        }
        Update: {
          backed_up_at?: string | null
          id?: string | null
          longest_streak?: number | null
          name?: string | null
          streak?: number | null
        }
        Relationships: []
      }
      levels: {
        Row: {
          id: number
          level_number: number
          xp_required: number
        }
        Insert: {
          id?: number
          level_number: number
          xp_required: number
        }
        Update: {
          id?: number
          level_number?: number
          xp_required?: number
        }
        Relationships: []
      }
      news: {
        Row: {
          brand_id: string
          category_id: number | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          image_url: string | null
          publication_date: string | null
          rejection_reason: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          category_id?: number | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          publication_date?: string | null
          rejection_reason?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          category_id?: number | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_url?: string | null
          publication_date?: string | null
          rejection_reason?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      news_categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_level: number | null
          display_name: string
          email: string | null
          experience_points: number | null
          id: string
          name: string
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_level?: number | null
          display_name?: string
          email?: string | null
          experience_points?: number | null
          id?: string
          name?: string
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_level?: number | null
          display_name?: string
          email?: string | null
          experience_points?: number | null
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      race_participants: {
        Row: {
          created_at: string | null
          email: string
          id: string
          redeemed_at: string | null
          runner_number: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          redeemed_at?: string | null
          runner_number: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          redeemed_at?: string | null
          runner_number?: string
        }
        Relationships: []
      }
      xp_actions: {
        Row: {
          action_key: string
          active: boolean | null
          id: number
          xp_value: number
        }
        Insert: {
          action_key: string
          active?: boolean | null
          id?: number
          xp_value: number
        }
        Update: {
          action_key?: string
          active?: boolean | null
          id?: number
          xp_value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_brand_id: { Args: never; Returns: string }
      get_my_brand_role: { Args: never; Returns: string }
      get_my_community_ids: { Args: never; Returns: string[] }
      is_community_admin: { Args: { p_community_id: string }; Returns: boolean }
      is_superadmin: { Args: never; Returns: boolean }
      redeem_prize: {
        Args: { p_email: string; p_runner_number: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
