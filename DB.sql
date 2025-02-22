/*
  # Esquema inicial del casino

  1. Nuevas Tablas
    - `users`: Información de usuarios
    - `games`: Registro de juegos
    - `game_participants`: Participantes en cada juego
    - `blackjack_games`: Datos específicos de juegos Blackjack
    - `bingo_games`: Datos específicos de juegos Bingo
    - `scratchcard_games`: Datos específicos de juegos de Rasca y Gana

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para lectura y escritura basadas en autenticación
*/

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text NOT NULL,
  balance decimal DEFAULT 1000.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de juegos
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type text NOT NULL CHECK (game_type IN ('blackjack', 'bingo', 'scratchcard')),
  status text NOT NULL CHECK (status IN ('waiting', 'in_progress', 'finished')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de participantes
CREATE TABLE IF NOT EXISTS game_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id),
  user_id uuid REFERENCES users(id),
  bet_amount decimal NOT NULL,
  winnings decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla específica para Blackjack
CREATE TABLE IF NOT EXISTS blackjack_games (
  id uuid PRIMARY KEY REFERENCES games(id),
  dealer_cards text[] NOT NULL DEFAULT '{}',
  player_cards jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_player_id uuid REFERENCES users(id),
  deck text[] NOT NULL
);

-- Crear tabla específica para Bingo
CREATE TABLE IF NOT EXISTS bingo_games (
  id uuid PRIMARY KEY REFERENCES games(id),
  called_numbers integer[] DEFAULT '{}',
  current_number integer,
  cards jsonb NOT NULL DEFAULT '{}'::jsonb,
  winner_id uuid REFERENCES users(id)
);

-- Crear tabla específica para Rasca y Gana
CREATE TABLE IF NOT EXISTS scratchcard_games (
  id uuid PRIMARY KEY REFERENCES games(id),
  symbols jsonb NOT NULL,
  prize decimal NOT NULL DEFAULT 0,
  revealed boolean DEFAULT false
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackjack_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE bingo_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE scratchcard_games ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read games they participate in"
  ON games FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_participants
      WHERE game_participants.game_id = games.id
      AND game_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read their game participation"
  ON game_participants FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insertar datos de ejemplo
INSERT INTO users (id, email, username, balance)
VALUES 
  ('d5e7c40a-1234-5678-90ab-cdef12345678', 'juan@ejemplo.com', 'juan123', 1000),
  ('f8b9a23c-9876-5432-10fe-dcba98765432', 'maria@ejemplo.com', 'maria456', 1500),
  ('c4d5e6f7-abcd-efgh-ijkl-mnop12345678', 'carlos@ejemplo.com', 'carlos789', 2000);

-- Insertar juegos de ejemplo
INSERT INTO games (id, game_type, status)
VALUES 
  ('a1b2c3d4-1234-5678-90ab-cdef12345678', 'blackjack', 'in_progress'),
  ('e5f6g7h8-9876-5432-10fe-dcba98765432', 'bingo', 'waiting'),
  ('i9j0k1l2-abcd-efgh-ijkl-mnop12345678', 'scratchcard', 'finished');