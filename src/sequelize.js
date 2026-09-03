import { Sequelize } from 'sequelize';
import { dbConfig } from './config.js';

export const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: 'postgres',
  logging: false,
});

export async function connectOrm() {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Sequelize conectado y modelos sincronizados');
}
