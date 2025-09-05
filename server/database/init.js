const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function initializeDatabase() {
  try {
    // First connection without database selection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('Connected to MySQL server');

    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .filter(statement => statement.trim().length > 0);

    // Execute each statement
    for (const statement of statements) {
      await connection.execute(statement + ';');
    }

    console.log('Database schema created successfully');
    await connection.end();

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
