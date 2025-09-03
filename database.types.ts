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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      diaries: {
        Row: {
          created_at: string
          date: string
          desired_reaction: string | null
          gratitude_moment: string | null
          id: number
          image_url: string | null
          is_deleted: boolean
          physical_sensation: string | null
          profile_id: string
          reaction: string | null
          self_kind_words: string | null
          short_content: string | null
          situation: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          desired_reaction?: string | null
          gratitude_moment?: string | null
          id?: never
          image_url?: string | null
          is_deleted?: boolean
          physical_sensation?: string | null
          profile_id: string
          reaction?: string | null
          self_kind_words?: string | null
          short_content?: string | null
          situation?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          desired_reaction?: string | null
          gratitude_moment?: string | null
          id?: never
          image_url?: string | null
          is_deleted?: boolean
          physical_sensation?: string | null
          profile_id?: string
          reaction?: string | null
          self_kind_words?: string | null
          short_content?: string | null
          situation?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diaries_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_tags: {
        Row: {
          created_at: string
          diary_id: number
          emotion_tag_id: number
          id: number
        }
        Insert: {
          created_at?: string
          diary_id: number
          emotion_tag_id: number
          id?: never
        }
        Update: {
          created_at?: string
          diary_id?: number
          emotion_tag_id?: number
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "diary_tags_diary_id_diaries_id_fk"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_tags_emotion_tag_id_emotion_tags_id_fk"
            columns: ["emotion_tag_id"]
            isOneToOne: false
            referencedRelation: "emotion_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      emotion_tags: {
        Row: {
          category: Database["public"]["Enums"]["emotion_category"] | null
          color: string | null
          created_at: string
          id: number
          is_default: boolean | null
          name: string
          profile_id: string | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["emotion_category"] | null
          color?: string | null
          created_at?: string
          id?: never
          is_default?: boolean | null
          name: string
          profile_id?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["emotion_category"] | null
          color?: string | null
          created_at?: string
          id?: never
          is_default?: boolean | null
          name?: string
          profile_id?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "emotion_tags_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          custom_message: string | null
          id: number
          is_enabled: boolean
          profile_id: string
          push_subscription: Json | null
          reminder_times: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_message?: string | null
          id?: never
          is_enabled?: boolean
          profile_id: string
          push_subscription?: Json | null
          reminder_times?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_message?: string | null
          id?: never
          is_enabled?: boolean
          profile_id?: string
          push_subscription?: Json | null
          reminder_times?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_name: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_name: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      emotion_category: "positive" | "negative" | "neutral"
      user_role: "admin" | "user"
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
    Enums: {
      emotion_category: ["positive", "negative", "neutral"],
      user_role: ["admin", "user"],
    },
  },
} as const
