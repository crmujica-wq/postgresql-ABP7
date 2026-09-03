import { Router } from 'express';
import {
  getUsers, getUser, createUser, editUser, deleteUser, createUserTransaction,
  getUsersOrm, compareSqlAndOrm, createOrder, getUserWithOrders,
} from '../controllers/users.controllers.js';

const router = Router();

router.get(['/users', '/usuarios'], getUsers);
router.post(['/users', '/usuarios'], createUser);
router.get(['/users/orm', '/usuarios/orm'], getUsersOrm);
router.get(['/users/comparison', '/usuarios/comparacion'], compareSqlAndOrm);
router.post(['/users/transaction', '/usuarios/transaccion'], createUserTransaction);
router.post(['/users/:id/orders', '/usuarios/:id/pedidos'], createOrder);
router.get(['/users/:id/orders', '/usuarios/:id/pedidos'], getUserWithOrders);
router.get(['/users/:id', '/usuarios/:id'], getUser);
router.put(['/users/:id', '/usuarios/:id'], editUser);
router.delete(['/users/:id', '/usuarios/:id'], deleteUser);

export default router;
