import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import * as VesselModel from '../models/vessel.js';
import * as LocationModel from '../models/location.js';

const router = express.Router();

router.post('/:vesselId',
	authenticateToken,
	[
		param('vesselId').isInt(),
		body('latitude').isFloat({ min: -90, max: 90 }),
		body('longitude').isFloat({ min: -180, max: 180 })
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { vesselId } = req.params;
		const { latitude, longitude } = req.body;

		const vessel = VesselModel.getVesselById(vesselId, req.user.userId);
		if (!vessel) {
			return res.status(404).json({ error: 'Vessel not found or unauthorized' });
		}

		const result = LocationModel.addLocation(vesselId, latitude, longitude);

		res.status(201).json({
			id: result.lastInsertRowid,
			vessel_id: vesselId,
			latitude,
			longitude,
			timestamp: new Date().toISOString()
		});
	}
);

router.get('/:vesselId',
	authenticateToken,
	[param('vesselId').isInt()],
	(req, res) => {
		const { vesselId } = req.params;
		const vessel = VesselModel.getVesselById(vesselId, req.user.userId);

		if (!vessel) {
			return res.status(404).json({ error: 'Vessel not found or unauthorized' });
		}

		const locations = LocationModel.getLocationHistory(vesselId);
		res.json(locations);
	}
);

export default router;