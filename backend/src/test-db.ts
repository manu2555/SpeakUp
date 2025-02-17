import { sequelize } from './config/database';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Try to create the database if it doesn't exist
    try {
      await sequelize.query('CREATE DATABASE speakup;');
      console.log('Database created successfully');
    } catch (err) {
      console.log('Database already exists or cannot be created');
    }
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection(); 