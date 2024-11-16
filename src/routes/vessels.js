import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import * as VesselModel from '../models/vessel.js';

const router = express.Router();

router.post('/',
	authenticateToken,
	[body('name').isLength({ min: 1 })],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name } = req.body;
		const result = VesselModel.createVessel(name, req.user.userId);

		res.status(201).json({
			id: result.lastInsertRowid,
			name,
			user_id: req.user.userId
		});
	}
);

router.get('/',
	authenticateToken,
	(req, res) => {
		const vessels = VesselModel.getVesselsByUser(req.user.userId);
		res.json(vessels);
	}
);

export default router;