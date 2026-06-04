import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Fallback to individual fields if DATABASE_URL not set
      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || 'localhost',
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || 'hab_telemetry',
      user: process.env.DATABASE_URL ? undefined : process.env.DB_USER || 'postgres',
      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// SQL to create the telemetry table — run this once
export const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS telemetry (
  id               SERIAL PRIMARY KEY,
  hab_id           VARCHAR(64),
  mission_time     VARCHAR(32),
  packet_no        INTEGER,
  temperature      FLOAT,
  pressure         FLOAT,
  humidity         FLOAT,
  uv_index         FLOAT,
  magnetic_field   FLOAT,
  latitude         DOUBLE PRECISION,
  longitude        DOUBLE PRECISION,
  altitude         FLOAT,
  battery_percent  FLOAT,
  gyro_x           FLOAT,
  gyro_y           FLOAT,
  gyro_z           FLOAT,
  accel_x          FLOAT,
  accel_y          FLOAT,
  accel_z          FLOAT,
  camera_status    VARCHAR(32),
  status_flag      VARCHAR(64),
  rssi             INTEGER,
  timestamp        TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_hab_id    ON telemetry (hab_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_packet_no ON telemetry (packet_no);
`;
