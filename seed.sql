-- Seed demo data
INSERT INTO profiles (id, full_name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Demo User')
ON CONFLICT DO NOTHING;

INSERT INTO teams (id, name, slug, owner_id) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Demo Team', 'demo-team', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

INSERT INTO team_members (team_id, user_id, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO kernels (id, team_id, name, description, status) VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Marcus Aurelius', 'Roman Emperor and Stoic Philosopher (121-180 AD)', 'idle'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Cleopatra VII', 'Last Active Pharaoh of Egypt (69-30 BC)', 'idle')
ON CONFLICT DO NOTHING;

INSERT INTO kernel_settings (kernel_id, models, weights, safety) VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', '{"embed":"bge-m3","llm":"gpt-4"}', '{"pair":0.32,"single":0.12,"cluster":0.16,"scar_phase":0.14,"bias":0.10,"refusal":0.10,"mask":0.06}', '{"clear_strictness":0.8}'),
  ('550e8400-e29b-41d4-a716-446655440003', '{"embed":"bge-m3","llm":"gpt-4"}', '{"pair":0.32,"single":0.12,"cluster":0.16,"scar_phase":0.14,"bias":0.10,"refusal":0.10,"mask":0.06}', '{"clear_strictness":0.8}')
ON CONFLICT DO NOTHING;

INSERT INTO contradictions (id, kernel_id, pole_a, pole_b, collapse_direction, scar_valence, refusal, life_phase, summary) VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Duty', 'Desire', 'duty', 0.75, false, 'reign', 'The tension between imperial duty and personal desires'),
  ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'Reason', 'Emotion', 'reason', 0.65, false, 'philosophy', 'Stoic philosophy vs human emotion'),
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Power', 'Love', 'power', 0.82, true, 'reign', 'Political power vs romantic love'),
  ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'Ambition', 'Survival', 'ambition', 0.71, false, 'decline', 'Ambition for Egypt vs personal survival')
ON CONFLICT DO NOTHING;

INSERT INTO graph_edges (id, kernel_id, pole_a, pole_b, frequency, direction_bias, scar_sum) VALUES 
  ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002', 'Duty', 'Reason', 3, 0.5, 1.4),
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'Desire', 'Emotion', 2, 0.6, 0.8),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440003', 'Power', 'Ambition', 4, 0.7, 1.53),
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440003', 'Love', 'Survival', 3, 0.4, 0.82)
ON CONFLICT DO NOTHING;

INSERT INTO chat_threads (id, kernel_id, team_id, user_id, title) VALUES 
  ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'On Stoicism and Duty'),
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Egypt and Power')
ON CONFLICT DO NOTHING;

INSERT INTO chat_messages (id, thread_id, role, content) VALUES 
  ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440030', 'user', 'What is your philosophy on duty?'),
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440030', 'assistant', 'Duty is the highest calling. As emperor, I must place the welfare of Rome above my own desires.'),
  ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440031', 'user', 'How did you balance power and love?'),
  ('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440031', 'assistant', 'Love and power are often at odds. I chose Egypt, but the cost was personal.')
ON CONFLICT DO NOTHING;
