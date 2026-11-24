export type AssessmentLevel = 1 | 2 | 3 | 4 | 5;

export interface StateItem {
  id: number;
  code: string;
  name: string;
  type: 'State' | 'Union Territory';
}

export interface CityItem {
  id: number;
  state_id: number;
  name: string;
  tier?: string;
}

export interface LanguageItem {
  id: number;
  code: string;
  name: string;
  native_name: string;
  is_reviewed: boolean;
  is_active: boolean;
}

export interface AssessmentQuestion {
  id: string; // e.g. "L1_Q1"
  set_code: string; // e.g. "SET_A"
  level_number: number;
  level_title: string;
  question_number: number;
  question_type: string;
  skill_category: string;
  difficulty: string;
  stimulus_type?: 'notice' | 'instructions' | 'bill' | 'schedule' | 'statement' | 'passage' | 'two_sources' | 'table' | 'graph' | 'scenario' | 'none';
  stimulus_title?: string;
  stimulus_content?: string;
  stimulus_metadata?: any;
  question_text: string;
  options: { label: string; text: string }[];
  correct_answer?: string; // Hidden in public API
  explanation?: string; // Hidden until submitted
}

export interface AssessmentSession {
  id: string;
  state_id: number;
  city_id: number;
  city_other?: string;
  language_code: string;
  started_at: string;
  updated_at: string;
  completed_at?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  current_level: number;
  current_question: number;
  answers: Record<string, string>;
}

export interface AssessmentResult {
  id: string;
  session_id: string;
  total_score: number;
  max_score: number;
  percentage: number;
  meets_benchmark: boolean;
  provisional_level: string;
  provisional_level_num: number;
  category_scores: Record<string, { correct: number; total: number; percentage: number }>;
  level_scores: Record<string, { correct: number; total: number; percentage: number }>;
  strongest_skill: string;
  improvement_areas: string[];
  generated_at: string;
  state_name?: string;
  city_name?: string;
  language_name?: string;
  detailed_reviews?: {
    question_id: string;
    level_title: string;
    question_text: string;
    stimulus_title?: string;
    stimulus_content?: string;
    selected_option: string;
    correct_option: string;
    is_correct: boolean;
    explanation: string;
    skill_category: string;
    options: { label: string; text: string }[];
  }[];
}

export interface TriviaQuestion {
  id: number;
  category: string;
  question: string;
  options: { label: string; text: string }[];
  correct_answer: string;
  explanation: string;
  verified_source: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
}

export interface FactCard {
  id: number;
  category: string;
  title: string;
  main_number: string;
  unit: string;
  short_explanation: string;
  formula: string;
  formula_components: { label: string; key: string; default_val: number; unit: string; step: number; min: number; max: number }[];
  calculation_example: string;
  source: string;
  reference_date: string;
  plain_meaning: string;
  sort_order: number;
}
