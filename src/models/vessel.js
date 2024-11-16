import db from '../db.js';

export function createVessel(name, userId) {
	const stmt = db.prepare('INSERT INTO vessels (name, user_id) VALUES (?, ?)');
	return stmt.run(name, userId);
}

export function getVesselsByUser(userId) {
	const stmt = db.prepare('SELECT * FROM vessels WHERE user_id = ?');
	return stmt.all(userId);
}

export function getVesselById(vesselId, userId) {
	const stmt = db.prepare('SELECT * FROM vessels WHERE id = ? AND user_id = ?');
	return stmt.get(vesselId, userId);
}