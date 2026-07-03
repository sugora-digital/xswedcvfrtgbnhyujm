import pg from 'pg';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectionString = "postgres://postgres.ekrjdfkqitjbxafrtglx:qVjuNGVUt9hDMiIH@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require";

async function main() {
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Successfully connected to Supabase PostgreSQL!');

    // 1. Create table 'notes'
    console.log('Creating "notes" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title text NOT NULL,
        created_at timestamptz DEFAULT now()
      );
    `);

    // Enable RLS for notes
    console.log('Enabling Row Level Security for "notes"...');
    await client.query(`ALTER TABLE notes ENABLE ROW LEVEL SECURITY;`);

    // Drop existing policies if any
    console.log('Re-creating RLS policies for "notes"...');
    await client.query(`DROP POLICY IF EXISTS "public can read notes" ON notes;`);
    await client.query(`DROP POLICY IF EXISTS "public can insert notes" ON notes;`);
    await client.query(`DROP POLICY IF EXISTS "public can delete notes" ON notes;`);

    // Create policies
    await client.query(`
      CREATE POLICY "public can read notes" ON notes
        FOR SELECT TO anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "public can insert notes" ON notes
        FOR INSERT TO anon WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "public can delete notes" ON notes
        FOR DELETE TO anon USING (true);
    `);

    // 2. Create table 'waitlist'
    console.log('Creating "waitlist" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        email text NOT NULL,
        created_at timestamptz DEFAULT now()
      );
    `);

    // Enable RLS for waitlist
    console.log('Enabling Row Level Security for "waitlist"...');
    await client.query(`ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;`);

    // Drop existing policies if any
    console.log('Re-creating RLS policies for "waitlist"...');
    await client.query(`DROP POLICY IF EXISTS "public can read waitlist" ON waitlist;`);
    await client.query(`DROP POLICY IF EXISTS "public can insert waitlist" ON waitlist;`);
    await client.query(`DROP POLICY IF EXISTS "public can delete waitlist" ON waitlist;`);

    // Create policies
    await client.query(`
      CREATE POLICY "public can read waitlist" ON waitlist
        FOR SELECT TO anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "public can insert waitlist" ON waitlist
        FOR INSERT TO anon WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "public can delete waitlist" ON waitlist
        FOR DELETE TO anon USING (true);
    `);

    // 3. Create table 'profiles' for username/email mapping and availability checks
    console.log('Creating "profiles" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id uuid PRIMARY KEY,
        username text UNIQUE NOT NULL,
        email text UNIQUE NOT NULL,
        created_at timestamptz DEFAULT now()
      );
    `);

    // Alter profiles table to add administrative columns
    console.log('Altering "profiles" table with administrative and user fields...');
    await client.query(`
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'User' NOT NULL;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active' NOT NULL;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name text;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar text;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz DEFAULT now();
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS force_logout_at timestamptz;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS online_status text DEFAULT 'offline';
    `);

    // 4. Create website_settings table
    console.log('Creating "website_settings" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS website_settings (
        id text PRIMARY KEY DEFAULT 'current',
        website_name text DEFAULT 'Sugora',
        website_description text DEFAULT 'A modern, fast, and completely sovereign digital communication platform designed to bypass corporate server telemetry. Fully verifiable, secure, and local-first.',
        logo text DEFAULT '',
        favicon text DEFAULT '',
        primary_color text DEFAULT '#0d9488',
        secondary_color text DEFAULT '#4f46e5',
        theme text DEFAULT 'system',
        footer text DEFAULT 'Zero-knowledge sharding transit nodes compliant',
        contact_email text DEFAULT 'contact@sugora.io',
        social_links jsonb DEFAULT '{"github": "https://github.com/sugora", "twitter": ""}'::jsonb,
        maintenance_mode boolean DEFAULT false,
        landing_page_text text DEFAULT 'Built for the next century of freedom.',
        homepage_hero text DEFAULT 'Sovereign Digital Communication',
        buttons_text text DEFAULT 'Get Started',
        seo_metadata jsonb DEFAULT '{"title": "Sugora - Sovereign Digital Communication", "description": "A secure, decentralized communication tool."}'::jsonb,
        open_graph jsonb DEFAULT '{"title": "Sugora", "image": ""}'::jsonb,
        twitter_metadata jsonb DEFAULT '{"card": "summary_large_image"}'::jsonb,
        updated_at timestamptz DEFAULT now()
      );
    `);

    // Seed website_settings if empty
    const checkWebsiteSettings = await client.query('SELECT COUNT(*) FROM website_settings;');
    if (parseInt(checkWebsiteSettings.rows[0].count) === 0) {
      console.log('Inserting default website_settings row...');
      await client.query(`
        INSERT INTO website_settings (id) VALUES ('current');
      `);
    }

    // 5. Create auth_settings table
    console.log('Creating "auth_settings" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS auth_settings (
        id text PRIMARY KEY DEFAULT 'current',
        registration_enabled boolean DEFAULT true,
        require_email_verification boolean DEFAULT false,
        minimum_password_length integer DEFAULT 8,
        username_rules text DEFAULT '3-20 characters using letters, numbers, or underscores',
        session_timeout integer DEFAULT 3600,
        remember_me boolean DEFAULT true,
        updated_at timestamptz DEFAULT now()
      );
    `);

    // Seed auth_settings if empty
    const checkAuthSettings = await client.query('SELECT COUNT(*) FROM auth_settings;');
    if (parseInt(checkAuthSettings.rows[0].count) === 0) {
      console.log('Inserting default auth_settings row...');
      await client.query(`
        INSERT INTO auth_settings (id) VALUES ('current');
      `);
    }

    // 6. Create chat_settings table
    console.log('Creating "chat_settings" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_settings (
        id text PRIMARY KEY DEFAULT 'current',
        enable_chat boolean DEFAULT true,
        message_length integer DEFAULT 2000,
        allowed_file_types text DEFAULT 'jpg,png,gif,pdf,txt,mp3,mp4,zip',
        maximum_upload_size integer DEFAULT 10485760,
        allowed_image_types text DEFAULT 'jpg,png,gif,webp',
        typing_indicator boolean DEFAULT true,
        read_receipts boolean DEFAULT true,
        online_status boolean DEFAULT true,
        last_seen boolean DEFAULT true,
        updated_at timestamptz DEFAULT now()
      );
    `);

    // Seed chat_settings if empty
    const checkChatSettings = await client.query('SELECT COUNT(*) FROM chat_settings;');
    if (parseInt(checkChatSettings.rows[0].count) === 0) {
      console.log('Inserting default chat_settings row...');
      await client.query(`
        INSERT INTO chat_settings (id) VALUES ('current');
      `);
    }

    // 7. Create support_tickets table
    console.log('Creating "support_tickets" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
        title text NOT NULL,
        description text NOT NULL,
        status text DEFAULT 'open' NOT NULL, -- 'open', 'pending', 'resolved'
        assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `);

    // 8. Create support_messages table
    console.log('Creating "support_messages" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_messages (
        id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        ticket_id bigint REFERENCES support_tickets(id) ON DELETE CASCADE,
        sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
        message text NOT NULL,
        created_at timestamptz DEFAULT now()
      );
    `);

    // 9. Create storage_files table
    console.log('Creating "storage_files" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS storage_files (
        id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name text NOT NULL,
        size bigint NOT NULL,
        type text NOT NULL, -- 'image', 'video', 'document', 'voice'
        url text NOT NULL,
        uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
        created_at timestamptz DEFAULT now()
      );
    `);

    // 10. Create conversations table
    console.log('Creating "conversations" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id text PRIMARY KEY,
        type text NOT NULL,
        title text,
        avatar text,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        pinned_by text[] DEFAULT '{}'::text[],
        archived_by text[] DEFAULT '{}'::text[],
        muted_by text[] DEFAULT '{}'::text[],
        pinned_message_ids text[] DEFAULT '{}'::text[],
        blocked_by text[] DEFAULT '{}'::text[],
        reported_by text[] DEFAULT '{}'::text[]
      );
    `);

    // 11. Create participants table
    console.log('Creating "participants" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS participants (
        conversation_id text REFERENCES conversations(id) ON DELETE CASCADE,
        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
        joined_at timestamptz DEFAULT now(),
        PRIMARY KEY (conversation_id, user_id)
      );
    `);

    // 12. Create messages table
    console.log('Creating "messages" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id text PRIMARY KEY,
        conversation_id text REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
        text text NOT NULL,
        type text DEFAULT 'text' NOT NULL,
        status text DEFAULT 'sent' NOT NULL,
        created_at timestamptz DEFAULT now(),
        edited_at timestamptz,
        deleted_for_everyone boolean DEFAULT false,
        deleted_for_users text[] DEFAULT '{}'::text[],
        parent_message_id text,
        attachment jsonb,
        starred_by text[] DEFAULT '{}'::text[],
        reactions jsonb DEFAULT '{}'::jsonb
      );
    `);

    // Create Indexes
    console.log('Creating indexes for chat performance...');
    await client.query(`CREATE INDEX IF NOT EXISTS idx_participants_user ON participants(user_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);`);

    // 13. Create calls table
    console.log('Creating "calls" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS calls (
        id text PRIMARY KEY,
        caller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
        receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
        type text NOT NULL,
        status text DEFAULT 'ringing' NOT NULL,
        started_at timestamptz DEFAULT now(),
        ended_at timestamptz,
        duration integer DEFAULT 0
      );
    `);

    // 14. Create notification_preferences table
    console.log('Creating "notification_preferences" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_preferences (
        user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
        message_notifications boolean DEFAULT true,
        call_notifications boolean DEFAULT true,
        notification_sounds boolean DEFAULT true,
        vibration boolean DEFAULT true
      );
    `);

    // 15. Create device_registrations table
    console.log('Creating "device_registrations" table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS device_registrations (
        id text PRIMARY KEY,
        user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
        token text NOT NULL UNIQUE,
        platform text,
        created_at timestamptz DEFAULT now()
      );
    `);

    // Enable RLS for chat & call tables
    console.log('Enabling Row Level Security for chat & call tables...');
    await client.query(`ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE participants ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE messages ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE calls ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE device_registrations ENABLE ROW LEVEL SECURITY;`);

    // Drop and re-create RLS policies for chat & call tables
    console.log('Re-creating RLS policies for chat & call tables...');
    await client.query(`DROP POLICY IF EXISTS "select_conversations" ON conversations;`);
    await client.query(`DROP POLICY IF EXISTS "insert_conversations" ON conversations;`);
    await client.query(`DROP POLICY IF EXISTS "update_conversations" ON conversations;`);
    await client.query(`DROP POLICY IF EXISTS "delete_conversations" ON conversations;`);
    
    await client.query(`DROP POLICY IF EXISTS "select_participants" ON participants;`);
    await client.query(`DROP POLICY IF EXISTS "insert_participants" ON participants;`);
    await client.query(`DROP POLICY IF EXISTS "delete_participants" ON participants;`);

    await client.query(`DROP POLICY IF EXISTS "select_messages" ON messages;`);
    await client.query(`DROP POLICY IF EXISTS "insert_messages" ON messages;`);
    await client.query(`DROP POLICY IF EXISTS "update_messages" ON messages;`);
    await client.query(`DROP POLICY IF EXISTS "delete_messages" ON messages;`);

    await client.query(`DROP POLICY IF EXISTS "select_calls" ON calls;`);
    await client.query(`DROP POLICY IF EXISTS "insert_calls" ON calls;`);
    await client.query(`DROP POLICY IF EXISTS "update_calls" ON calls;`);
    await client.query(`DROP POLICY IF EXISTS "delete_calls" ON calls;`);

    await client.query(`DROP POLICY IF EXISTS "manage_notification_preferences" ON notification_preferences;`);
    await client.query(`DROP POLICY IF EXISTS "manage_device_registrations" ON device_registrations;`);

    // Create policies
    await client.query(`
      CREATE POLICY "select_conversations" ON conversations
        FOR SELECT TO authenticated, anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "insert_conversations" ON conversations
        FOR INSERT TO authenticated, anon WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "update_conversations" ON conversations
        FOR UPDATE TO authenticated, anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "delete_conversations" ON conversations
        FOR DELETE TO authenticated, anon USING (true);
    `);

    await client.query(`
      CREATE POLICY "select_participants" ON participants
        FOR SELECT TO authenticated, anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "insert_participants" ON participants
        FOR INSERT TO authenticated, anon WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "delete_participants" ON participants
        FOR DELETE TO authenticated, anon USING (true);
    `);

    await client.query(`
      CREATE POLICY "select_messages" ON messages
        FOR SELECT TO authenticated, anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "insert_messages" ON messages
        FOR INSERT TO authenticated, anon WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "update_messages" ON messages
        FOR UPDATE TO authenticated, anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "delete_messages" ON messages
        FOR DELETE TO authenticated, anon USING (true);
    `);

    await client.query(`
      CREATE POLICY "select_calls" ON calls
        FOR SELECT TO authenticated, anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "insert_calls" ON calls
        FOR INSERT TO authenticated, anon WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "update_calls" ON calls
        FOR UPDATE TO authenticated, anon USING (true);
    `);
    await client.query(`
      CREATE POLICY "delete_calls" ON calls
        FOR DELETE TO authenticated, anon USING (true);
    `);

    await client.query(`
      CREATE POLICY "manage_notification_preferences" ON notification_preferences
        FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
    `);

    await client.query(`
      CREATE POLICY "manage_device_registrations" ON device_registrations
        FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);
    `);

    // Enable RLS for profiles
    console.log('Enabling Row Level Security for "profiles"...');
    await client.query(`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`);

    // Drop existing policies if any
    console.log('Re-creating RLS policies for "profiles"...');
    await client.query(`DROP POLICY IF EXISTS "public can read profiles" ON profiles;`);
    await client.query(`DROP POLICY IF EXISTS "public can insert own profile" ON profiles;`);
    await client.query(`DROP POLICY IF EXISTS "public can update own profile" ON profiles;`);

    // Create policies
    await client.query(`
      CREATE POLICY "public can read profiles" ON profiles
        FOR SELECT TO anon, authenticated USING (true);
    `);
    await client.query(`
      CREATE POLICY "public can insert own profile" ON profiles
        FOR INSERT TO anon, authenticated WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "public can update own profile" ON profiles
        FOR UPDATE TO authenticated USING (true);
    `);

    // Enable RLS and setup policies for settings tables
    console.log('Enabling RLS and re-creating policies for setting and ticket tables...');
    
    // RLS
    await client.query(`ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE auth_settings ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;`);
    await client.query(`ALTER TABLE storage_files ENABLE ROW LEVEL SECURITY;`);

    // drop config policies
    await client.query(`DROP POLICY IF EXISTS "anyone can read website settings" ON website_settings;`);
    await client.query(`DROP POLICY IF EXISTS "anyone can read auth settings" ON auth_settings;`);
    await client.query(`DROP POLICY IF EXISTS "anyone can read chat settings" ON chat_settings;`);
    await client.query(`DROP POLICY IF EXISTS "admin can update website settings" ON website_settings;`);
    await client.query(`DROP POLICY IF EXISTS "admin can update auth settings" ON auth_settings;`);
    await client.query(`DROP POLICY IF EXISTS "admin can update chat settings" ON chat_settings;`);

    // create config policies
    await client.query(`CREATE POLICY "anyone can read website settings" ON website_settings FOR SELECT USING (true);`);
    await client.query(`CREATE POLICY "anyone can read auth settings" ON auth_settings FOR SELECT USING (true);`);
    await client.query(`CREATE POLICY "anyone can read chat settings" ON chat_settings FOR SELECT USING (true);`);
    await client.query(`CREATE POLICY "admin can update website settings" ON website_settings FOR ALL USING (true);`);
    await client.query(`CREATE POLICY "admin can update auth settings" ON auth_settings FOR ALL USING (true);`);
    await client.query(`CREATE POLICY "admin can update chat settings" ON chat_settings FOR ALL USING (true);`);

    // ticket policies
    await client.query(`DROP POLICY IF EXISTS "anyone can manage tickets" ON support_tickets;`);
    await client.query(`DROP POLICY IF EXISTS "anyone can manage ticket messages" ON support_messages;`);
    await client.query(`DROP POLICY IF EXISTS "anyone can manage storage files" ON storage_files;`);

    await client.query(`CREATE POLICY "anyone can manage tickets" ON support_tickets FOR ALL USING (true);`);
    await client.query(`CREATE POLICY "anyone can manage ticket messages" ON support_messages FOR ALL USING (true);`);
    await client.query(`CREATE POLICY "anyone can manage storage files" ON storage_files FOR ALL USING (true);`);

    // Insert initial notes if empty
    const checkNotes = await client.query('SELECT COUNT(*) FROM notes;');
    if (parseInt(checkNotes.rows[0].count) === 0) {
      console.log('Inserting sample data into "notes"...');
      await client.query(`
        INSERT INTO notes (title) VALUES
          ('Today I created a Supabase project.'),
          ('I added some data and queried it from Next.js.'),
          ('It was awesome!');
      `);
    }

    // 16. Enable Supabase Realtime publication for tables
    console.log('Enabling Supabase Realtime publication on tables...');
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
          CREATE PUBLICATION supabase_realtime;
        END IF;

        BEGIN
          ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
        EXCEPTION WHEN others THEN
          RAISE NOTICE 'Table conversations might already be in publication';
        END;

        BEGIN
          ALTER PUBLICATION supabase_realtime ADD TABLE participants;
        EXCEPTION WHEN others THEN
          RAISE NOTICE 'Table participants might already be in publication';
        END;

        BEGIN
          ALTER PUBLICATION supabase_realtime ADD TABLE messages;
        EXCEPTION WHEN others THEN
          RAISE NOTICE 'Table messages might already be in publication';
        END;

        BEGIN
          ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
        EXCEPTION WHEN others THEN
          RAISE NOTICE 'Table profiles might already be in publication';
        END;
      END $$;
    `);

    console.log('Database schema successfully provisioned and updated!');
  } catch (err) {
    console.error('Database setup failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
