import { User } from './User.js';
import { Order } from './Order.js';

User.hasMany(Order, { foreignKey: 'user_id', as: 'pedidos' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'usuario' });

export { User, Order };
