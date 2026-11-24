import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'platform.db');

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  dbInstance = new DatabaseSync(DB_PATH);
  initSchema(dbInstance);
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA foreign_keys = ON;
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS states (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      tier TEXT DEFAULT 'Tier 2',
      FOREIGN KEY (state_id) REFERENCES states(id)
    );

    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      native_name TEXT NOT NULL,
      is_reviewed INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS assessment_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      set_code TEXT NOT NULL,
      level_number INTEGER NOT NULL,
      level_title TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      question_type TEXT NOT NULL,
      skill_category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      stimulus_type TEXT,
      stimulus_title TEXT,
      stimulus_content TEXT,
      stimulus_metadata TEXT,
      question_text TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      FOREIGN KEY (set_code) REFERENCES assessment_sets(code)
    );

    CREATE TABLE IF NOT EXISTS question_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id TEXT NOT NULL,
      language_code TEXT NOT NULL,
      stimulus_title TEXT,
      stimulus_content TEXT,
      question_text TEXT NOT NULL,
      options_json TEXT NOT NULL,
      explanation TEXT NOT NULL,
      is_verified INTEGER DEFAULT 1,
      UNIQUE(question_id, language_code),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );

    CREATE TABLE IF NOT EXISTS assessment_sessions (
      id TEXT PRIMARY KEY,
      state_id INTEGER NOT NULL,
      city_id INTEGER,
      city_other TEXT,
      language_code TEXT NOT NULL,
      started_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      completed_at TEXT,
      status TEXT NOT NULL,
      current_level INTEGER DEFAULT 1,
      current_question INTEGER DEFAULT 1,
      answers_json TEXT DEFAULT '{}',
      client_ip_hash TEXT,
      FOREIGN KEY (state_id) REFERENCES states(id)
    );

    CREATE TABLE IF NOT EXISTS assessment_results (
      id TEXT PRIMARY KEY,
      session_id TEXT UNIQUE NOT NULL,
      total_score INTEGER NOT NULL,
      max_score INTEGER NOT NULL,
      percentage REAL NOT NULL,
      meets_benchmark INTEGER NOT NULL,
      provisional_level TEXT NOT NULL,
      provisional_level_num INTEGER NOT NULL,
      category_scores_json TEXT NOT NULL,
      level_scores_json TEXT NOT NULL,
      strongest_skill TEXT NOT NULL,
      improvement_areas_json TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES assessment_sessions(id)
    );

    CREATE TABLE IF NOT EXISTS trivia_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      verified_source TEXT NOT NULL,
      difficulty TEXT DEFAULT 'Medium'
    );

    CREATE TABLE IF NOT EXISTS fact_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      main_number TEXT NOT NULL,
      unit TEXT NOT NULL,
      short_explanation TEXT NOT NULL,
      formula TEXT NOT NULL,
      formula_components_json TEXT NOT NULL,
      calculation_example TEXT NOT NULL,
      source TEXT NOT NULL,
      reference_date TEXT NOT NULL,
      plain_meaning TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS statistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stat_key TEXT UNIQUE NOT NULL,
      stat_value REAL NOT NULL,
      stat_unit TEXT,
      label TEXT NOT NULL,
      category TEXT NOT NULL,
      notes TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    );
  `);
}
