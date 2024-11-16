import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import db from '../db.js';

const router = express.Router();

router.post('/register',
	[
		body('username').isLength({ min: 3 }),
		body('password').isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { username, password } = req.body;

		try {
			const hashedPassword = await bcrypt.hash(password, 10);

			const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
			stmt.run(username, hashedPassword);

			res.status(201).json({ message: 'User registered successfully' });
		} catch (error) {
			if (error.code === 'SQLITE_CONSTRAINT') {
				return res.status(400).json({ error: 'Username already exists' });
			}
			res.status(500).json({ error: 'Server error' });
		}
	}
);

router.post('/login',
	[
		body('username').exists(),
		body('password').exists()
	],
	async (req, res) => {
		const { username, password } = req.body;

		try {
			const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
			const user = stmt.get(username);

			if (!user || !(await bcrypt.compare(password, user.password))) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			const token = jwt.sign(
				{ userId: user.id, username: user.username },
				process.env.JWT_SECRET,
				{ expiresIn: '24h' }
			);

			res.json({ token });
		} catch (error) {
			res.status(500).json({ error: 'Server error' });
		}
	}
);

export default router;