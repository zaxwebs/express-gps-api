import db from '../db.js';

export function addLocation(vesselId, latitude, longitude) {
	const stmt = db.prepare(`
    INSERT INTO locations (vessel_id, latitude, longitude, timestamp)
    VALUES (?, ?, ?, unixepoch())
  `);
	return stmt.run(vesselId, latitude, longitude);
}

export function getLocationHistory(vesselId, limit = 100) {
	const stmt = db.prepare(`
    SELECT id, vessel_id, latitude, longitude,
           datetime(timestamp, 'unixepoch') as timestamp
    FROM locations 
    WHERE vessel_id = ? 
    ORDER BY timestamp DESC 
    LIMIT ?
  `);
	return stmt.all(vesselId, limit);
}