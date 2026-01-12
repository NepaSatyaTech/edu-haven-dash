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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_years: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_current: boolean
          name: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_current?: boolean
          name: string
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_current?: boolean
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      admission_inquiries: {
        Row: {
          created_at: string
          email: string
          grade: string
          id: string
          is_read: boolean
          message: string | null
          parent_name: string
          phone: string
          status: string
          student_name: string
        }
        Insert: {
          created_at?: string
          email: string
          grade: string
          id?: string
          is_read?: boolean
          message?: string | null
          parent_name: string
          phone: string
          status?: string
          student_name: string
        }
        Update: {
          created_at?: string
          email?: string
          grade?: string
          id?: string
          is_read?: boolean
          message?: string | null
          parent_name?: string
          phone?: string
          status?: string
          student_name?: string
        }
        Relationships: []
      }
      class_subjects: {
        Row: {
          class_id: string
          created_at: string
          id: string
          subject_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          subject_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          grade_level: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          grade_level: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          grade_level?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          is_published: boolean
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          is_published?: boolean
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          is_published?: boolean
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          academic_year_id: string
          class_id: string
          created_at: string
          end_date: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          id: string
          is_published: boolean
          name: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          academic_year_id: string
          class_id: string
          created_at?: string
          end_date?: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          id?: string
          is_published?: boolean
          name: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          academic_year_id?: string
          class_id?: string
          created_at?: string
          end_date?: string | null
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          is_published?: boolean
          name?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty: {
        Row: {
          bio: string | null
          created_at: string
          department: string | null
          designation: string
          display_order: number
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          passed_out_college: string | null
          phone: string | null
          qualification: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department?: string | null
          designation: string
          display_order?: number
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          passed_out_college?: string | null
          phone?: string | null
          qualification?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          department?: string | null
          designation?: string
          display_order?: number
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          passed_out_college?: string | null
          phone?: string | null
          qualification?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string
          created_at: string
          id: string
          image_url: string
          is_published: boolean
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          image_url: string
          is_published?: boolean
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          is_published?: boolean
          title?: string
        }
        Relationships: []
      }
      marks: {
        Row: {
          created_at: string
          exam_id: string
          grade: Database["public"]["Enums"]["grade_type"] | null
          id: string
          marks_obtained: number | null
          remarks: string | null
          student_id: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam_id: string
          grade?: Database["public"]["Enums"]["grade_type"] | null
          id?: string
          marks_obtained?: number | null
          remarks?: string | null
          student_id: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam_id?: string
          grade?: Database["public"]["Enums"]["grade_type"] | null
          id?: string
          marks_obtained?: number | null
          remarks?: string | null
          student_id?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marks_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          category: string
          content: string | null
          created_at: string
          id: string
          is_published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          class_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value_en: string
          value_ne: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value_en: string
          value_ne?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value_en?: string
          value_ne?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          address: string | null
          class_id: string
          created_at: string
          date_of_birth: string
          email: string | null
          father_name: string
          full_name: string
          id: string
          mother_name: string
          phone: string | null
          photo_url: string | null
          roll_number: number
          section_id: string
          status: Database["public"]["Enums"]["student_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          class_id: string
          created_at?: string
          date_of_birth: string
          email?: string | null
          father_name: string
          full_name: string
          id?: string
          mother_name: string
          phone?: string | null
          photo_url?: string | null
          roll_number: number
          section_id: string
          status?: Database["public"]["Enums"]["student_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          class_id?: string
          created_at?: string
          date_of_birth?: string
          email?: string | null
          father_name?: string
          full_name?: string
          id?: string
          mother_name?: string
          phone?: string | null
          photo_url?: string | null
          roll_number?: number
          section_id?: string
          status?: Database["public"]["Enums"]["student_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          full_marks: number
          id: string
          name: string
          pass_marks: number
        }
        Insert: {
          code: string
          created_at?: string
          full_marks?: number
          id?: string
          name: string
          pass_marks?: number
        }
        Update: {
          code?: string
          created_at?: string
          full_marks?: number
          id?: string
          name?: string
          pass_marks?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content_en: string
          content_ne: string | null
          created_at: string
          display_order: number
          id: string
          initials: string | null
          is_published: boolean
          name: string
          rating: number
          role_en: string
          role_ne: string | null
          updated_at: string
        }
        Insert: {
          content_en: string
          content_ne?: string | null
          created_at?: string
          display_order?: number
          id?: string
          initials?: string | null
          is_published?: boolean
          name: string
          rating?: number
          role_en: string
          role_ne?: string | null
          updated_at?: string
        }
        Update: {
          content_en?: string
          content_ne?: string | null
          created_at?: string
          display_order?: number
          id?: string
          initials?: string | null
          is_published?: boolean
          name?: string
          rating?: number
          role_en?: string
          role_ne?: string | null
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
      calculate_grade: {
        Args: { full_marks: number; marks_obtained: number }
        Returns: Database["public"]["Enums"]["grade_type"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator"
      exam_type: "first_terminal" | "second_terminal" | "final"
      grade_type: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E"
      student_status: "active" | "inactive" | "graduated" | "transferred"
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
      app_role: ["admin", "moderator"],
      exam_type: ["first_terminal", "second_terminal", "final"],
      grade_type: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "E"],
      student_status: ["active", "inactive", "graduated", "transferred"],
    },
  },
} as const
