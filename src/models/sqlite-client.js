import sqlite3 from "sqlite3";

sqlite3.verbose();

export default class SQLiteClient {
    constructor() {
        this.db = null;
    }

    async open_db() {
        if (!this.db) {
            this.db = new sqlite3.Database("finance-bot.db", (err) => {
                if (err) {
                    console.error("Error opening database:", err.message);
                }
            });

            await this.run(`
                CREATE TABLE IF NOT EXISTS despenses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    description TEXT NOT NULL,
                    category TEXT NOT NULL,
                    value REAL NOT NULL,
                    created_at TEXT NOT NULL
                )
            `);

            await this.run(`
                CREATE TABLE IF NOT EXISTS revenues (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    description TEXT NOT NULL,
                    value REAL NOT NULL,
                    created_at TEXT NOT NULL
                )
            `);

            await this.run(`
                CREATE TABLE IF NOT EXISTS budgets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    category TEXT NOT NULL,
                    value REAL NOT NULL,
                    created_at TEXT NOT NULL
                )
            `);
        }
        return this.db;
    }

    close_db() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error("Error closing database:", err.message);
                }
            });
            this.db = null;
        }
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

    async insert_despense(despense) {
        const db = await this.open_db();
        const sql = `INSERT INTO despenses (user_id, description, category, value, created_at) VALUES (?, ?, ?, ?, ?)`;
        await this.run(sql, [despense.user_id, despense.description, despense.category, despense.value, despense.created_at]);
        this.close_db();
    }

    async insert_revenue(revenue) {
        const db = await this.open_db();
        const sql = `INSERT INTO revenues (user_id, description, value, created_at) VALUES (?, ?, ?, ?)`; 
        await this.run(sql, [revenue.user_id, revenue.description, revenue.value, revenue.created_at]);
        this.close_db();
    }

    async get_report(user_id) {
        const db = await this.open_db();

        const sql = `
            SELECT 
                d.category, 
                SUM(d.value) AS total_despenses, 
                SUM(r.value) AS total_revenues
            FROM despenses d
            LEFT JOIN revenues r 
                ON d.user_id = r.user_id 
                AND r.created_at >= date('now', '-1 month')
            WHERE d.user_id = ? 
              AND d.created_at >= date('now', '-1 month')
            GROUP BY d.category
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        }).finally(() => {
            this.close_db();
        });
    }

    async set_budget(budget) {
        const db = await this.open_db();
        const sql = `INSERT OR REPLACE INTO budgets (user_id, category, value, created_at) VALUES (?, ?, ?, ?)`;
        await this.run(sql, [budget.user_id, budget.category, budget.value, budget.created_at]);
        this.close_db();
    }
}