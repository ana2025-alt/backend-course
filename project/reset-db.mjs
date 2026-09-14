import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { pool } from './src/database/pool.js';

async function reset() {
  const client = await pool.connect();
  try {
    console.log('Reiniciando base de datos...');
    
    // 1. Limpiar tablas existentes en orden de dependencias
    await client.query('DROP TABLE IF EXISTS request_status_history CASCADE;');
    await client.query('DROP TABLE IF EXISTS requests CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');

    // 2. Leer y aplicar migraciones en orden secuencial
    const migrationsDir = path.resolve('database/migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    for (const file of files) {
      console.log(`Aplicando ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await client.query(sql);
    }

    // 3. Aplicar seed si existe
    const seedPath = path.resolve('database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('Aplicando seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await client.query(seedSql);
    }

    console.log('--- BASE DE DATOS REINICIADA CON UUID ---');
  } catch (err) {
    console.error('Error durante la migración:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

reset();