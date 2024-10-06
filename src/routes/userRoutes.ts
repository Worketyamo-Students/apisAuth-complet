import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/authController';

const router = Router();

router.get('/', verifyToken, getAllUsers); // Récupérer tous les utilisateurs
router.get('/:id', verifyToken, getUserById); // Récupérer un utilisateur par ID
router.put('/:id', verifyToken, updateUser); // Mettre à jour un utilisateur
router.delete('/:id', verifyToken, deleteUser); // Supprimer un utilisateur


export { router as userRoutes };