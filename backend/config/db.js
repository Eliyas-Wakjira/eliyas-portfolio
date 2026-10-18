/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MySQL persistence for the portfolio API.
 */
import mysql from "mysql2/promise";
import { db as seedData } from "./seedData.js";

const TABLES = Object.freeze({
  projects: "portfolio_projects",
  certificates: "portfolio_certificates",
  skills: "portfolio_skills",
  experiences: "portfolio_experiences",
  messages: "portfolio_messages",
  profile: "portfolio_profile"
});

let pool;

const getPool = () => {
  if (!pool) {
    throw new Error("Database is not initialized. Configure MySQL and start the API.");
  }
  return pool;
};

const db = {
  async initialize(profile) {
    const database = process.env.MYSQL_DATABASE || "eliyas_portfolio";
    if (!/^[A-Za-z0-9_]+$/.test(database)) {
      throw new Error("MYSQL_DATABASE may contain only letters, numbers, and underscores.");
    }
    const connectionOptions = {
      host: process.env.MYSQL_HOST || "127.0.0.1",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD || "",
      charset: "utf8mb4"
    };
    if (!connectionOptions.user) {
      throw new Error("MYSQL_USER is required to connect to the portfolio database.");
    }

    const connection = await mysql.createConnection(connectionOptions);
    try {
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`
      );
    } finally {
      await connection.end();
    }

    pool = mysql.createPool({
      ...connectionOptions,
      database,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
      queueLimit: 0,
      timezone: "Z"
    });

    await this.ensureSchema();
    await this.seedIfEmpty(profile);
    await this.query("SELECT 1");
  },

  async ensureSchema() {
    const connection = getPool();
    const statements = [
      `CREATE TABLE IF NOT EXISTS portfolio_projects (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        data JSON NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
      `CREATE TABLE IF NOT EXISTS portfolio_certificates (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        data JSON NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
      `CREATE TABLE IF NOT EXISTS portfolio_skills (
        id VARCHAR(191) NOT NULL PRIMARY KEY,
        data JSON NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
      `CREATE TABLE IF NOT EXISTS portfolio_experiences (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        data JSON NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
      `CREATE TABLE IF NOT EXISTS portfolio_messages (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        data JSON NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`,
      `CREATE TABLE IF NOT EXISTS portfolio_profile (
        id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
        data JSON NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT portfolio_profile_singleton CHECK (id = 1)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
    ];
    for (const statement of statements) await connection.query(statement);
  },

  async seedIfEmpty(profile) {
    const seeds = {
      projects: seedData.projects,
      certificates: seedData.certificates,
      skills: seedData.skills,
      experiences: seedData.experiences,
      messages: [],
      profile: [profile]
    };
    for (const [entity, records] of Object.entries(seeds)) {
      const table = TABLES[entity];
      const [rows] = await getPool().query(`SELECT COUNT(*) AS count FROM \`${table}\``);
      if (Number(rows[0].count) !== 0) continue;
      for (const record of records) {
        if (entity === "profile") {
          await getPool().query(
            `INSERT INTO \`${table}\` (id, data) VALUES (1, ?)`,
            [JSON.stringify(record)]
          );
        } else if (entity === "skills") {
          await getPool().query(
            `INSERT INTO \`${table}\` (id, data) VALUES (?, ?)`,
            [String(record.id), JSON.stringify(record)]
          );
        } else {
          await getPool().query(
            `INSERT INTO \`${table}\` (id, data) VALUES (?, ?)`,
            [record.id, JSON.stringify(record)]
          );
        }
      }
    }
  },

  async list(entity) {
    const table = TABLES[entity];
    if (!table) throw new Error(`Unknown database collection: ${entity}`);
    const [rows] = await getPool().query(`SELECT id, data FROM \`${table}\` ORDER BY id`);
    return rows.map(({ id, data }) => ({ ...data, id: entity === "skills" ? String(id) : Number(id) }));
  },

  async get(entity, id) {
    const table = TABLES[entity];
    if (!table) throw new Error(`Unknown database collection: ${entity}`);
    const [rows] = await getPool().execute(
      `SELECT id, data FROM \`${table}\` WHERE id = ? LIMIT 1`,
      [entity === "skills" ? String(id) : Number(id)]
    );
    if (!rows.length) return null;
    return { ...rows[0].data, id: entity === "skills" ? String(rows[0].id) : Number(rows[0].id) };
  },

  async insert(entity, record) {
    const table = TABLES[entity];
    if (!table || entity === "profile") throw new Error(`Cannot create a record in ${entity}.`);
    if (entity === "skills") {
      const id = String(record.id);
      await getPool().execute(`INSERT INTO \`${table}\` (id, data) VALUES (?, ?)`, [id, JSON.stringify(record)]);
      return { ...record, id };
    }
    const [result] = await getPool().execute(`INSERT INTO \`${table}\` (data) VALUES (?)`, [JSON.stringify(record)]);
    return { ...record, id: Number(result.insertId) };
  },

  async update(entity, id, record) {
    const table = TABLES[entity];
    if (!table || entity === "profile") throw new Error(`Cannot update a record in ${entity}.`);
    const [result] = await getPool().execute(
      `UPDATE \`${table}\` SET data = ? WHERE id = ?`,
      [JSON.stringify(record), entity === "skills" ? String(id) : Number(id)]
    );
    return result.affectedRows > 0;
  },

  async remove(entity, id) {
    const table = TABLES[entity];
    if (!table || entity === "profile") throw new Error(`Cannot delete a record from ${entity}.`);
    const [result] = await getPool().execute(
      `DELETE FROM \`${table}\` WHERE id = ?`,
      [entity === "skills" ? String(id) : Number(id)]
    );
    return result.affectedRows > 0;
  },

  async saveProfile(profile) {
    await getPool().execute(
      `INSERT INTO portfolio_profile (id, data) VALUES (1, ?)
       ON DUPLICATE KEY UPDATE data = VALUES(data)`,
      [JSON.stringify(profile)]
    );
    return profile;
  },

  async query(sql) {
    if (typeof sql !== "string" || !/^\s*SELECT\b/i.test(sql) || /;\s*\S/.test(sql)) {
      throw new Error("Only one read-only SELECT query is allowed.");
    }
    const [rows, fields] = await getPool().query(sql);
    return {
      columns: fields.map((field) => field.name),
      rows,
      rowCount: rows.length
    };
  }
};

export { db };
