import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { STATES_DATA, CITIES_DATA, LANGUAGES_DATA } from '../src/lib/seedData.ts';
import { ALL_QUESTIONS } from '../src/lib/allQuestionsData.ts';
import { TRIVIA_DATA, FACTS_DATA } from '../src/lib/triviaAndFactsData.ts';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'platform.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;
  PRAGMA foreign_keys = OFF; -- Temporarily off during batch seeding
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
    tier TEXT DEFAULT 'Tier 2'
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
    explanation TEXT NOT NULL
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
    UNIQUE(question_id, language_code)
  );

  CREATE TABLE IF NOT EXISTS assessment_sessions (
    id TEXT PRIMARY KEY,
    set_code TEXT DEFAULT 'SET_A',
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
    client_ip_hash TEXT
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
    generated_at TEXT NOT NULL
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

console.log('Seeding 140 questions across Sets A, B, C, and D...');

// Clear existing tables
db.exec(`
  DELETE FROM states;
  DELETE FROM cities;
  DELETE FROM languages;
  DELETE FROM assessment_sets;
  DELETE FROM questions;
  DELETE FROM question_translations;
  DELETE FROM trivia_questions;
  DELETE FROM fact_cards;
  DELETE FROM statistics;
  DELETE FROM admin_users;
`);

// 1. States & Cities
const insertState = db.prepare('INSERT INTO states (code, name, type) VALUES (?, ?, ?)');
const insertCity = db.prepare('INSERT INTO cities (state_id, name, tier) VALUES (?, ?, ?)');

for (const s of STATES_DATA) {
  insertState.run(s.code, s.name, s.type);
  const stateRow = db.prepare('SELECT id FROM states WHERE code = ?').get(s.code);
  if (stateRow) {
    const cities = CITIES_DATA[s.code] || [s.name + ' Central', s.name + ' East'];
    for (const cityName of cities) {
      insertCity.run(stateRow.id, cityName, 'Tier 2');
    }
    insertCity.run(stateRow.id, 'Other / Unlisted City', 'General');
  }
}

// 2. Languages
const insertLang = db.prepare('INSERT INTO languages (code, name, native_name, is_reviewed, is_active) VALUES (?, ?, ?, ?, ?)');
for (const l of LANGUAGES_DATA) {
  insertLang.run(l.code, l.name, l.native_name, l.is_reviewed, l.is_active);
}

// 3. Assessment Sets - All 4 sets active
const insertSet = db.prepare('INSERT INTO assessment_sets (code, name, version, is_active) VALUES (?, ?, ?, ?)');
insertSet.run('SET_A', 'Set A — Core Foundation & Functional Literacy', 'V1', 1);
insertSet.run('SET_B', 'Set B — Analytical Framework & Daily Interpretations', 'V1', 1);
insertSet.run('SET_C', 'Set C — Quantitative Reasoning & Consumer Data', 'V1', 1);
insertSet.run('SET_D', 'Set D — Critical Media & Public Systems Literacy', 'V1', 1);

// 4. Questions & Translations (ALL 140 QUESTIONS)
const insertQ = db.prepare(`
  INSERT INTO questions (
    id, set_code, level_number, level_title, question_number, question_type,
    skill_category, difficulty, stimulus_type, stimulus_title, stimulus_content,
    stimulus_metadata, question_text, options_json, correct_answer, explanation
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertTrans = db.prepare(`
  INSERT INTO question_translations (
    question_id, language_code, stimulus_title, stimulus_content,
    question_text, options_json, explanation, is_verified
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const q of ALL_QUESTIONS) {
  insertQ.run(
    q.id,
    q.set_code,
    q.level_number,
    q.level_title,
    q.question_number,
    q.question_type,
    q.skill_category,
    q.difficulty,
    q.stimulus_type || null,
    q.stimulus_title || null,
    q.stimulus_content || null,
    q.stimulus_metadata ? JSON.stringify(q.stimulus_metadata) : null,
    q.question_text,
    JSON.stringify(q.options),
    q.correct_answer,
    q.explanation
  );

  if (q.translations) {
    for (const [langCode, t] of Object.entries(q.translations)) {
      insertTrans.run(
        q.id,
        langCode,
        t.stimulus_title || null,
        t.stimulus_content || null,
        t.question_text,
        JSON.stringify(t.options),
        t.explanation,
        1
      );
    }
  }
}

// 5. Trivia Questions
const insertTrivia = db.prepare(`
  INSERT INTO trivia_questions (category, question, options_json, correct_answer, explanation, verified_source, difficulty)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
for (const t of TRIVIA_DATA) {
  insertTrivia.run(t.category, t.question, JSON.stringify(t.options), t.correct_answer, t.explanation, t.verified_source, t.difficulty);
}

// 6. Facts Cards
const insertFact = db.prepare(`
  INSERT INTO fact_cards (id, category, title, main_number, unit, short_explanation, formula, formula_components_json, calculation_example, source, reference_date, plain_meaning, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
for (const f of FACTS_DATA) {
  insertFact.run(
    f.id,
    f.category,
    f.title,
    f.main_number,
    f.unit,
    f.short_explanation,
    f.formula,
    f.formula_components_json,
    f.calculation_example,
    f.source,
    f.reference_date,
    f.plain_meaning,
    f.sort_order
  );
}

// 7. Base Statistics - Clean, Real Database Tracking (Zero Fake Offsets)
const insertStat = db.prepare(`
  INSERT INTO statistics (stat_key, stat_value, stat_unit, label, category, notes, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const now = new Date().toISOString();
insertStat.run('total_started', 0, 'participants', 'Total participants who have started the survey', 'platform', 'Live real-time telemetry', now);
insertStat.run('total_completed', 0, 'assessments', 'Total completed assessments', 'platform', 'Live real-time telemetry', now);
insertStat.run('benchmark_attainment_pct', 0.0, '%', 'Benchmark attainment among completed participants', 'platform', 'Live real-time telemetry', now);
insertStat.run('participating_states', 0, 'states & UTs', 'Number of participating states and union territories', 'platform', 'Live real-time telemetry', now);

// 8. Admin User (admin / admin123)
const insertAdmin = db.prepare(`
  INSERT INTO admin_users (username, password_hash, role, created_at)
  VALUES (?, ?, ?, ?)
`);
insertAdmin.run('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'superadmin', now);

db.exec(`PRAGMA foreign_keys = ON;`);

console.log('Seeding successfully completed! 140 questions, 4 active sets, clean live telemetry ready.');
