const https = require('https');

const PROJECT_ID = 'leap-2df27';
const DB_URL = 'leap-2df27-default-rtdb.firebaseio.com';

let packetNo    = 1;
let altitude    = 100;
let battery     = 100;
let lat         = 19.0760;
let lng         = 72.8777;
let missionSecs = 0;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function randn(mean, std)  { return mean + std * (Math.random() - 0.5) * 2; }

function pushToFirebase(packet) {
  const data = JSON.stringify(packet);
  const options = {
    hostname: DB_URL,
    path: '/telemetry.json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = https.request(options, (res) => {
    // success - no need to read response
    res.resume();
  });

  req.on('error', (e) => console.error('Send error:', e.message));
  req.write(data);
  req.end();
}

async function sendPacket() {
  const ascending = altitude < 30000;
  altitude += ascending ? randn(12, 4) : randn(-8, 4);
  altitude  = clamp(altitude, 0, 35000);
  battery  -= 0.05;
  lat      += randn(0, 0.0003);
  lng      += randn(0, 0.0003);
  missionSecs++;

  const mins = String(Math.floor(missionSecs / 60)).padStart(2, '0');
  const secs = String(missionSecs % 60).padStart(2, '0');
  const temp = clamp(25 - altitude * 0.0065 + randn(0, 0.5), -60, 40);

  const packet = {
    HAB_ID:          'HAB-MUM-01',
    MISSION_TIME:    `00:${mins}:${secs}`,
    PACKET_NO:       packetNo++,
    TEMPERATURE:     parseFloat(temp.toFixed(2)),
    PRESSURE:        parseFloat(clamp(1013 * Math.pow(1 - altitude / 44330, 5.255), 1, 1013).toFixed(2)),
    HUMIDITY:        parseFloat(clamp(randn(45, 10) - altitude * 0.001, 5, 95).toFixed(1)),
    UV_INDEX:        parseFloat(clamp(randn(3, 1) + altitude * 0.0002, 0, 15).toFixed(2)),
    MAGNETIC_FIELD:  parseFloat(randn(45, 3).toFixed(2)),
    LATITUDE:        parseFloat(lat.toFixed(6)),
    LONGITUDE:       parseFloat(lng.toFixed(6)),
    ALTITUDE:        parseFloat(altitude.toFixed(1)),
    TIMESTAMP:       new Date().toISOString(),
    BATTERY_PERCENT: parseFloat(clamp(battery, 0, 100).toFixed(1)),
    GYRO_X:          parseFloat(randn(0, 15).toFixed(3)),
    GYRO_Y:          parseFloat(randn(0, 15).toFixed(3)),
    GYRO_Z:          parseFloat(randn(0, 8).toFixed(3)),
    ACCEL_X:         parseFloat(randn(0, 1.5).toFixed(3)),
    ACCEL_Y:         parseFloat(randn(0, 1.5).toFixed(3)),
    ACCEL_Z:         parseFloat(randn(9.8, 0.5).toFixed(3)),
    CAMERA_STATUS:   altitude > 500 ? 'ON' : 'OFF',
    STATUS_FLAG:     battery > 15 ? 'OK' : 'LOW_BAT',
    RSSI:            Math.round(clamp(randn(-65, 10) - altitude * 0.001, -120, -40)),
  };

  pushToFirebase(packet);
  console.log(`📡 PKT #${packet.PACKET_NO} | Alt: ${altitude.toFixed(0)}m | Temp: ${temp.toFixed(1)}°C | Bat: ${battery.toFixed(0)}%`);
}

console.log('🎈 Simulator started — sending every 2s. Ctrl+C to stop.\n');
sendPacket();
setInterval(sendPacket, 2000);