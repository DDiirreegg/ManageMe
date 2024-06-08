import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = 'your_jwt_secret';
const JWT_REFRESH_SECRET = 'your_jwt_refresh_secret';
const GOOGLE_CLIENT_ID = '59481472193-doc97ilgbanabgdjtv15th31gcdo8iiv.apps.googleusercontent.com'; // Ваш клиентский ID

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

let refreshTokens: string[] = [];

interface User {
  id: number | string;
  username: string;
  password: string;
  role: string;
}

const users: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'password',
    role: 'admin'
  },
  {
    id: 2,
    username: 'devops',
    password: 'password',
    role: 'devops'
  },
  {
    id: 3,
    username: 'developer',
    password: 'password',
    role: 'developer'
  }
];

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userid = payload?.sub;

    if (!userid) {
      return res.status(400).send('Invalid Google token');
    }

    let user = users.find(u => u.id === userid);

    if (!user) {
      user = {
        id: userid,
        username: payload?.email || '',
        password: '', // Пустой пароль для пользователей Google
        role: 'user' // Присвойте роль по умолчанию
      };
      users.push(user);
    }

    const accessToken = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ username: user.username, role: user.role }, JWT_REFRESH_SECRET);

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(401).send('Google authentication failed');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const accessToken = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '20m' });
    const refreshToken = jwt.sign({ username: user.username, role: user.role }, JWT_REFRESH_SECRET);

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).send('Username or password incorrect');
  }
});

app.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).send('Refresh Token required');
  }

  if (!refreshTokens.includes(token)) {
    return res.status(403).send('Invalid Refresh Token');
  }

  try {
    const user = jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload;
    const accessToken = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '20m' });

    res.json({ accessToken });
  } catch (err) {
    res.status(403).send('Invalid Refresh Token');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
