const pool = require('../config/database');

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'TODO',
        assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Activity log table for notifications
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('All tables created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
};

createTables();
