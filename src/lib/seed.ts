import { getDb } from './db';
import { STATES_DATA, CITIES_DATA, LANGUAGES_DATA } from './seedData';
import { ALL_QUESTIONS } from './allQuestionsData';
import { TRIVIA_DATA, FACTS_DATA } from './triviaAndFactsData';

export function runSeed(force = false) {
  const db = getDb();
  try {
    const existing = db.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number } | undefined;
    if (!force && existing && existing.count >= 140) {
      return; // Already populated with all 140 questions
    }
  } catch (e) {
    // If table doesn't exist, continue with full initialization
  }

  db.exec(`
    PRAGMA foreign_keys = OFF;
    DELETE FROM states;
    DELETE FROM cities;
    DELETE FROM languages;
    DELETE FROM assessment_sets;
    DELETE FROM questions;
    DELETE FROM question_translations;
    DELETE FROM trivia_questions;
    DELETE FROM fact_cards;
    DELETE FROM statistics;
  `);

  // States & Cities
  const insertState = db.prepare('INSERT INTO states (code, name, type) VALUES (?, ?, ?)');
  const insertCity = db.prepare('INSERT INTO cities (state_id, name, tier) VALUES (?, ?, ?)');

  for (const s of STATES_DATA) {
    insertState.run(s.code, s.name, s.type);
    const stateRow = db.prepare('SELECT id FROM states WHERE code = ?').get(s.code) as { id: number } | undefined;
    if (stateRow) {
      const cities = CITIES_DATA[s.code] || [s.name + ' Central', s.name + ' East'];
      for (const cityName of cities) {
        insertCity.run(stateRow.id, cityName, 'Tier 2');
      }
      insertCity.run(stateRow.id, 'Other / Unlisted City', 'General');
    }
  }

  // Languages
  const insertLang = db.prepare('INSERT INTO languages (code, name, native_name, is_reviewed, is_active) VALUES (?, ?, ?, ?, ?)');
  for (const l of LANGUAGES_DATA) {
    insertLang.run(l.code, l.name, l.native_name, l.is_reviewed, l.is_active);
  }

  // Sets
  const insertSet = db.prepare('INSERT INTO assessment_sets (code, name, version, is_active) VALUES (?, ?, ?, ?)');
  insertSet.run('SET_A', 'Set A — Core Foundation & Functional Literacy', 'V1', 1);
  insertSet.run('SET_B', 'Set B — Analytical Framework & Daily Interpretations', 'V1', 1);
  insertSet.run('SET_C', 'Set C — Quantitative Reasoning & Consumer Data', 'V1', 1);
  insertSet.run('SET_D', 'Set D — Critical Media & Public Systems Literacy', 'V1', 1);

  // 140 Questions
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

  // Trivia
  const insertTrivia = db.prepare(`
    INSERT INTO trivia_questions (category, question, options_json, correct_answer, explanation, verified_source, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const t of TRIVIA_DATA) {
    insertTrivia.run(t.category, t.question, JSON.stringify(t.options), t.correct_answer, t.explanation, t.verified_source, t.difficulty);
  }

  // Facts
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

  // Clean Real-Time Statistics
  const now = new Date().toISOString();
  const insertStat = db.prepare(`
    INSERT INTO statistics (stat_key, stat_value, stat_unit, label, category, notes, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertStat.run('total_started', 0, 'participants', 'Total participants who have started the survey', 'platform', 'Live real-time telemetry', now);
  insertStat.run('total_completed', 0, 'assessments', 'Total completed assessments', 'platform', 'Live real-time telemetry', now);
  insertStat.run('benchmark_attainment_pct', 0.0, '%', 'Benchmark attainment among completed participants', 'platform', 'Live real-time telemetry', now);
  insertStat.run('participating_states', 0, 'states & UTs', 'Number of participating states and union territories', 'platform', 'Live real-time telemetry', now);

  // Admin user
  try {
    const adminCheck = db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
    if (!adminCheck || adminCheck.count === 0) {
      db.prepare(`
        INSERT INTO admin_users (username, password_hash, role, created_at)
        VALUES (?, ?, ?, ?)
      `).run('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'superadmin', now);
    }
  } catch (e) {
    // Ignore
  }

  db.exec('PRAGMA foreign_keys = ON;');
}

export function ensureDbInitialized() {
  getDb();
  runSeed(false);
}
