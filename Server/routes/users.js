import express from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Users } from '../drizzle/schema.js';
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const router = express.Router();

const client = postgres(process.env.DATABASE_URL);
const db4 = drizzle(client, { schema: { Users }, logger: true });

// Sign-up (Add new user)
router.post('/sign-up', async (req, res) => {
  const { companyName, companyEmail, password, address, phone, gst, pan } = req.body;

  try {
    const [newUser] = await db4
      .insert(Users)
      .values({
        name: companyName,
        mail: companyEmail,
        password,
        address,
        phone: Number(phone),
        gst: Number(gst),
        pan: Number(pan),
      })
      .returning();

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
