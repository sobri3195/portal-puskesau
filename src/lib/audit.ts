import { supabase } from './supabase';

export const writeAuditLog = async (payload: {
  actor_id?: string;
  action: string;
  entity: string;
  entity_id?: string;
  metadata_json?: Record<string, unknown>;
}) => {
  await supabase.from('audit_logs').insert(payload);
};
