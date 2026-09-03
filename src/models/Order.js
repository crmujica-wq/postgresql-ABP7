import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.js';

export const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  product: { type: DataTypes.STRING(255), allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'orders', timestamps: false });
