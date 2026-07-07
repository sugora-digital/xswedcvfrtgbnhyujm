-- Create custom types
CREATE TYPE message_type AS ENUM ('text', 'emoji', 'image', 'video', 'audio', 'voice', 'pdf', 'document', 'system');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read', 'failed');
CREATE TYPE chat_type AS ENUM ('one-to-one', 'group', 'support');

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'User',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT
);

-- Conversations Table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type chat_type NOT NULL,
  title TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  pinned_by UUID[] DEFAULT '{}',
  archived_by UUID[] DEFAULT '{}',
  muted_by UUID[] DEFAULT '{}'
);

-- Conversation Participants
CREATE TABLE conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  text TEXT,
  type message_type NOT NULL DEFAULT 'text',
  status message_status NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  deleted_for_everyone BOOLEAN DEFAULT FALSE,
  deleted_for_users UUID[] DEFAULT '{}',
  parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL
);

-- Message Attachments Table
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Starred Messages Table
CREATE TABLE starred_messages (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  starred_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, message_id)
);

-- Message Reactions Table
CREATE TABLE message_reactions (
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (message_id, user_id)
);

-- RLS Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE starred_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read profiles. Users can only update their own.
CREATE POLICY "Profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Conversations: Users can read conversations they are a participant in.
CREATE POLICY "Users can view their conversations." ON conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert conversations." ON conversations FOR INSERT WITH CHECK (true);

-- Participants: 
CREATE POLICY "Users can view participants of their conversations." ON conversation_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid())
);

-- Messages: Users can view messages in their conversations.
CREATE POLICY "Users can view messages in their conversations." ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert messages in their conversations." ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their own messages." ON messages FOR UPDATE USING (auth.uid() = sender_id);

-- Attachments: Same logic
CREATE POLICY "Users can view attachments in their conversations." ON message_attachments FOR SELECT USING (
  EXISTS (SELECT 1 FROM messages JOIN conversation_participants ON messages.conversation_id = conversation_participants.conversation_id WHERE messages.id = message_attachments.message_id AND conversation_participants.user_id = auth.uid())
);
CREATE POLICY "Users can insert attachments to their messages." ON message_attachments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM messages WHERE id = message_attachments.message_id AND sender_id = auth.uid())
);

-- Starred Messages: Users can manage their own starred messages.
CREATE POLICY "Users can view their own starred messages." ON starred_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can star messages." ON starred_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unstar messages." ON starred_messages FOR DELETE USING (auth.uid() = user_id);

-- Reactions: Users can manage their own reactions.
CREATE POLICY "Users can view reactions in their conversations." ON message_reactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM messages JOIN conversation_participants ON messages.conversation_id = conversation_participants.conversation_id WHERE messages.id = message_reactions.message_id AND conversation_participants.user_id = auth.uid())
);
CREATE POLICY "Users can add reactions." ON message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their reactions." ON message_reactions FOR DELETE USING (auth.uid() = user_id);

-- Realtime Configuration
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE messages, message_attachments, starred_messages, message_reactions, conversation_participants, conversations;
