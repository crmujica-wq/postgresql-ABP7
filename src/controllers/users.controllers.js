import { pool } from '../db.js';
import { User, Order } from '../models/index.js';
import { findUsers, findUserById, insertUser, updateUser, removeUser } from '../services/users.service.js';

function validId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateUser(body, partial = false) {
  const errors = [];
  if (!partial && !body.name?.trim()) errors.push('name es obligatorio');
  if (!partial && !body.email?.trim()) errors.push('email es obligatorio');
  if (body.name !== undefined && !body.name?.trim()) errors.push('name no puede estar vacío');
  if (body.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push('email no tiene un formato válido');
  if (partial && body.name === undefined && body.email === undefined) errors.push('envía al menos name o email');
  return errors;
}

export async function getUsers(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const users = await findUsers({ name: req.query.name, page, limit });
    res.json({ page, limit, count: users.length, data: users });
  } catch (error) { next(error); }
}

export async function getUser(req, res, next) {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ message: 'ID inválido' });
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) { next(error); }
}

export async function createUser(req, res, next) {
  try {
    const errors = validateUser(req.body);
    if (errors.length) return res.status(400).json({ message: 'Datos inválidos', errors });
    const user = await insertUser({ name: req.body.name.trim(), email: req.body.email.trim().toLowerCase() });
    res.status(201).json({ message: 'Usuario creado', data: user });
  } catch (error) { next(error); }
}

export async function editUser(req, res, next) {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ message: 'ID inválido' });
    const errors = validateUser(req.body, true);
    if (errors.length) return res.status(400).json({ message: 'Datos inválidos', errors });
    const user = await updateUser(id, { name: req.body.name?.trim(), email: req.body.email?.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado', data: user });
  } catch (error) { next(error); }
}

export async function deleteUser(req, res, next) {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ message: 'ID inválido' });
    const user = await removeUser(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado', data: user });
  } catch (error) { next(error); }
}

export async function createUserTransaction(req, res, next) {
  const client = await pool.connect();
  try {
    const errors = validateUser(req.body);
    if (errors.length) return res.status(400).json({ message: 'Datos inválidos', errors });
    await client.query('BEGIN');
    const { rows } = await client.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
      [req.body.name.trim(), req.body.email.trim().toLowerCase()],
    );
    if (req.body.forceError === true) throw new Error('Error forzado para demostrar ROLLBACK');
    await client.query('INSERT INTO user_histories (user_id, action) VALUES ($1, $2)', [rows[0].id, 'Usuario creado mediante transacción']);
    await client.query('COMMIT');
    console.log(`Transacción confirmada para usuario ${rows[0].id}`);
    res.status(201).json({ message: 'Transacción completada', data: rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Transacción revertida: ${error.message}`);
    if (req.body.forceError === true) return res.status(409).json({ message: 'Transacción revertida correctamente', detail: error.message });
    next(error);
  } finally { client.release(); }
}

export async function getUsersOrm(_req, res, next) {
  try {
    const users = await User.findAll({ order: [['id', 'ASC']] });
    res.json({ source: 'Sequelize ORM', count: users.length, data: users });
  } catch (error) { next(error); }
}

export async function compareSqlAndOrm(_req, res, next) {
  try {
    const [sqlResult, ormResult] = await Promise.all([
      pool.query('SELECT id, name, email, created_at FROM users ORDER BY id'),
      User.findAll({ order: [['id', 'ASC']] }),
    ]);
    res.json({
      comparison: 'SQL manual y Sequelize consultan la misma tabla',
      sql: { count: sqlResult.rows.length, data: sqlResult.rows },
      orm: { count: ormResult.length, data: ormResult },
    });
  } catch (error) { next(error); }
}

export async function createOrder(req, res, next) {
  try {
    const userId = validId(req.params.id);
    const amount = Number(req.body.amount);
    if (!userId || !req.body.product?.trim() || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'ID, product y amount positivo son obligatorios' });
    }
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const order = await Order.create({ user_id: userId, product: req.body.product.trim(), amount });
    res.status(201).json({ message: 'Pedido creado', data: order });
  } catch (error) { next(error); }
}

export async function getUserWithOrders(req, res, next) {
  try {
    const id = validId(req.params.id);
    if (!id) return res.status(400).json({ message: 'ID inválido' });
    const user = await User.findByPk(id, {
      include: [{ model: Order, as: 'pedidos' }],
      order: [[{ model: Order, as: 'pedidos' }, 'id', 'ASC']],
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) { next(error); }
}
