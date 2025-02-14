const { Sequelize } = require('sequelize');
const { Client } = require('pg');
require('dotenv').config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

// Function to create database if it doesn't exist
async function createDatabaseIfNotExists() {
    const client = new Client({
        user: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT, 
        database: "postgres"  // Connect to default "postgres" database to check/create other databases
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}';`);

        if (res.rowCount === 0) {
            console.log(`Database "${DB_NAME}" does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${DB_NAME}";`);
            console.log(`Database "${DB_NAME}" created successfully.`);
        } else {
            console.log(`Database "${DB_NAME}" already exists.`);
        }
    } catch (error) {
        console.error("Error creating database:", error);
    } finally {
        await client.end();
    }
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,
});

// Initialize Sequelize **AFTER** the database is ensured
async function initializeSequelize(req, res, next) {
    try {
        await createDatabaseIfNotExists(); 
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL database');

        req.db = sequelize; 
        next(); 
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
}

module.exports = {
    sequelize,  
    initializeSequelize  
};