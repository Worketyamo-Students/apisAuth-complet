// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import morgan from 'morgan';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);
// Configurer le moteur de vue EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Dossier où se trouvent les fichiers EJS

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use(morgan('combined'));

setupSwagger(app);
export default app;
