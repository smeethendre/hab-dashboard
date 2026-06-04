import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit  = parseInt(searchParams.get('limit')  || '200');
  const offset = parseInt(searchParams.get('offset') || '0');
  const habId  = searchParams.get('hab_id');

  try {
    let sql = `
      SELECT * FROM telemetry
      ${habId ? "WHERE hab_id = $3" : ""}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const params: any[] = [limit, offset];
    if (habId) params.push(habId);

    const result = await query(sql, params);
    return NextResponse.json({ data: result.rows, total: result.rowCount });
  } catch (err: any) {
    console.error('DB query error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const p = body;

    const result = await query(`
      INSERT INTO telemetry (
        hab_id, mission_time, packet_no, temperature, pressure, humidity,
        uv_index, magnetic_field, latitude, longitude, altitude,
        battery_percent, gyro_x, gyro_y, gyro_z, accel_x, accel_y, accel_z,
        camera_status, status_flag, rssi, timestamp
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
        $12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
      ) RETURNING id
    `, [
      p.HAB_ID, p.MISSION_TIME, p.PACKET_NO, p.TEMPERATURE, p.PRESSURE, p.HUMIDITY,
      p.UV_INDEX, p.MAGNETIC_FIELD, p.LATITUDE, p.LONGITUDE, p.ALTITUDE,
      p.BATTERY_PERCENT, p.GYRO_X, p.GYRO_Y, p.GYRO_Z, p.ACCEL_X, p.ACCEL_Y, p.ACCEL_Z,
      p.CAMERA_STATUS, p.STATUS_FLAG, p.RSSI, p.TIMESTAMP,
    ]);

    return NextResponse.json({ id: result.rows[0].id });
  } catch (err: any) {
    console.error('DB insert error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
