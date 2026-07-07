const fs = require('fs');
let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const newCreateGroup = `  public createGroup(groupData: Conversation, participants: Participant[]) {
    this.conversations.push(groupData);
    this.participants.push(...participants);

    this.saveToStorage(['conversations', 'participants']);
    this.notifyListeners();

    const client = getRealSupabaseClient();
    if (client) {
      const insertPromise = client.from('conversations').insert({
        id: groupData.id,
        type: groupData.type,
        title: groupData.title,
        avatar: groupData.avatar,
        created_at: groupData.created_at,
        updated_at: groupData.updated_at,
        pinned_by: groupData.pinned_by,
        archived_by: groupData.archived_by,
        muted_by: groupData.muted_by
      }).then(({ error }) => {
        if (error) {
          console.error('Supabase conv insert error (Group):', error);
          throw error;
        }
      });

      this.pendingConvInserts.set(groupData.id, insertPromise);

      insertPromise.then(() => {
        const strippedParticipants = participants.map(p => ({
          conversation_id: p.conversation_id,
          user_id: p.user_id,
          joined_at: p.joined_at
        }));
        
        client.from('participants').insert(strippedParticipants).then(({ error }) => {
          if (error) console.error('Supabase participants insert error (Group):', error);
          else console.log('Group created in Supabase');
        });
      });

      setTimeout(() => {
        if (this.pendingConvInserts.get(groupData.id) === insertPromise) {
          this.pendingConvInserts.delete(groupData.id);
        }
      }, 5000);
    }
  }`;

content = content.replace(
  /  public createGroup\(groupData: Conversation, participants: Participant\[\]\) \{[\s\S]*?    \}\n  \}/,
  newCreateGroup
);

fs.writeFileSync('src/lib/chatStore.ts', content);
console.log('Patched createGroup logic');
