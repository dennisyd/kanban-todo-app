-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create boards table
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create columns table
CREATE TABLE columns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_columns_board_position ON columns(board_id, position);
CREATE INDEX idx_tasks_column_position ON tasks(column_id, position);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Boards policies
CREATE POLICY "Users can view own boards"
  ON boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own boards"
  ON boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boards"
  ON boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boards"
  ON boards FOR DELETE
  USING (auth.uid() = user_id);

-- Columns policies
CREATE POLICY "Users can view columns in own boards"
  ON columns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = columns.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create columns in own boards"
  ON columns FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = columns.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update columns in own boards"
  ON columns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = columns.board_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete columns in own boards"
  ON columns FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = columns.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Users can view tasks in own boards"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM columns
      INNER JOIN boards ON boards.id = columns.board_id
      WHERE columns.id = tasks.column_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in own boards"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM columns
      INNER JOIN boards ON boards.id = columns.board_id
      WHERE columns.id = tasks.column_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in own boards"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM columns
      INNER JOIN boards ON boards.id = columns.board_id
      WHERE columns.id = tasks.column_id
      AND boards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in own boards"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM columns
      INNER JOIN boards ON boards.id = columns.board_id
      WHERE columns.id = tasks.column_id
      AND boards.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE columns;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Enable full row data in realtime payloads (includes all fields in payload.old)
ALTER TABLE columns REPLICA IDENTITY FULL;
ALTER TABLE tasks REPLICA IDENTITY FULL;

