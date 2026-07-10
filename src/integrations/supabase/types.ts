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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      project_blocks: {
        Row: {
          alt_text: string | null
          block_type: Database["public"]["Enums"]["block_type"]
          caption: string | null
          content: string | null
          created_at: string
          display_order: number
          id: string
          media_url: string | null
          project_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          block_type: Database["public"]["Enums"]["block_type"]
          caption?: string | null
          content?: string | null
          created_at?: string
          display_order?: number
          id?: string
          media_url?: string | null
          project_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          block_type?: Database["public"]["Enums"]["block_type"]
          caption?: string | null
          content?: string | null
          created_at?: string
          display_order?: number
          id?: string
          media_url?: string | null
          project_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_blocks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          accent_color: string | null
          angle: string | null
          cover_image_alt_text: string | null
          cover_image_position: string
          cover_image_url: string | null
          created_at: string
          display_order: number
          emoji: string | null
          id: string
          impact: string | null
          mission_type: string | null
          photo_profil_alt_text: string | null
          photo_profil_url: string | null
          project_date: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          published: boolean
          repo_label: string | null
          repo_note: string | null
          repo_url: string | null
          role: string | null
          slug: string
          status_label: string | null
          summary: string | null
          tagline: string | null
          tags: string[]
          tags_categorises: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          angle?: string | null
          cover_image_alt_text?: string | null
          cover_image_position?: string
          cover_image_url?: string | null
          created_at?: string
          display_order?: number
          emoji?: string | null
          id?: string
          impact?: string | null
          mission_type?: string | null
          photo_profil_alt_text?: string | null
          photo_profil_url?: string | null
          project_date?: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          published?: boolean
          repo_label?: string | null
          repo_note?: string | null
          repo_url?: string | null
          role?: string | null
          slug: string
          status_label?: string | null
          summary?: string | null
          tagline?: string | null
          tags?: string[]
          tags_categorises?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          angle?: string | null
          cover_image_alt_text?: string | null
          cover_image_position?: string
          cover_image_url?: string | null
          created_at?: string
          display_order?: number
          emoji?: string | null
          id?: string
          impact?: string | null
          mission_type?: string | null
          photo_profil_alt_text?: string | null
          photo_profil_url?: string | null
          project_date?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          published?: boolean
          repo_label?: string | null
          repo_note?: string | null
          repo_url?: string | null
          role?: string | null
          slug?: string
          status_label?: string | null
          summary?: string | null
          tagline?: string | null
          tags?: string[]
          tags_categorises?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          benevolat_section_title: string
          contact_email: string
          contact_text: string | null
          cover_image_alt_text: string | null
          cover_image_url: string | null
          featured_section_title: string
          footer_text: string
          formations_section_title: string
          hero_intro: string
          hero_subtitle: string
          hero_title: string
          id: number
          linkedin_url: string | null
          location: string | null
          missions_section_title: string
          tools_json: Json
          tools_section_title: string
          updated_at: string
        }
        Insert: {
          benevolat_section_title?: string
          contact_email?: string
          contact_text?: string | null
          cover_image_alt_text?: string | null
          cover_image_url?: string | null
          featured_section_title?: string
          footer_text?: string
          formations_section_title?: string
          hero_intro?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          linkedin_url?: string | null
          location?: string | null
          missions_section_title?: string
          tools_json?: Json
          tools_section_title?: string
          updated_at?: string
        }
        Update: {
          benevolat_section_title?: string
          contact_email?: string
          contact_text?: string | null
          cover_image_alt_text?: string | null
          cover_image_url?: string | null
          featured_section_title?: string
          footer_text?: string
          formations_section_title?: string
          hero_intro?: string
          hero_subtitle?: string
          hero_title?: string
          id?: number
          linkedin_url?: string | null
          location?: string | null
          missions_section_title?: string
          tools_json?: Json
          tools_section_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      block_type:
        | "text"
        | "video"
        | "image"
        | "quote"
        | "heading"
        | "liste"
        | "comparatif"
      project_type:
        | "poc_perso"
        | "production_client"
        | "poc_ecole"
        | "formation_mission"
        | "profil"
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
      app_role: ["admin", "user"],
      block_type: [
        "text",
        "video",
        "image",
        "quote",
        "heading",
        "liste",
        "comparatif",
      ],
      project_type: [
        "poc_perso",
        "production_client",
        "poc_ecole",
        "formation_mission",
        "profil",
      ],
    },
  },
} as const
