import { compare } from 'bcryptjs';
import { query } from '../../db';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    console.log("username: ", username);
    console.log("password: ", password);
    try {
      const result = await query('SELECT * FROM tb_member WHERE std_code = $1', [username]);
      const user = result.rows[0];

      if (user && await compare(password, user.password)) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}