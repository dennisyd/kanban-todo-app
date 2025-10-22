export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          github_username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          github_username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          github_username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      boards: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      columns: {
        Row: {
          id: string
          board_id: string
          title: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          board_id: string
          title: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          title?: string
          position?: number
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          column_id: string
          title: string
          description: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          column_id: string
          title: string
          description?: string | null
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          column_id?: string
          title?: string
          description?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Board = Database['public']['Tables']['boards']['Row']
export type Column = Database['public']['Tables']['columns']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']

export interface BoardWithColumns extends Board {
  columns: ColumnWithTasks[]
}

export interface ColumnWithTasks extends Column {
  tasks: Task[]
}

