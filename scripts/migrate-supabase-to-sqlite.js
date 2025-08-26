#!/usr/bin/env node

/**
 * Migration script to export data from Supabase and import into SQLite
 * Usage: node scripts/migrate-supabase-to-sqlite.js
 */

import { createClient } from '@supabase/supabase-js';
import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize SQLite database
const dbPath = join(__dirname, '../db/database.sqlite');
const dbDir = dirname(dbPath);

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys and set performance optimizations
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

async function initializeSchema() {
  console.log('Initializing SQLite schema...');
  
  // Create schema
  const schemaSQL = readFileSync(join(__dirname, '../db/schema.sql'), 'utf-8');
  db.exec(schemaSQL);
  
  console.log('✅ Schema initialized');
}

async function migrateProjects() {
  console.log('Migrating projects...');
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }

  if (!projects || projects.length === 0) {
    console.log('No projects to migrate');
    return;
  }

  const insertProject = db.prepare(`
    INSERT OR REPLACE INTO projects (
      id, title, description, image_url, target, raised,
      start_date, end_date, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const project of projects) {
    insertProject.run(
      project.id,
      project.title,
      project.description,
      project.image_url,
      project.target,
      project.raised || 0,
      project.start_date,
      project.end_date,
      project.status,
      project.created_at,
      project.updated_at
    );
  }

  console.log(`✅ Migrated ${projects.length} projects`);
}

async function migrateDonations() {
  console.log('Migrating donations...');
  
  const { data: donations, error } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching donations:', error);
    return;
  }

  if (!donations || donations.length === 0) {
    console.log('No donations to migrate');
    return;
  }

  const insertDonation = db.prepare(`
    INSERT OR REPLACE INTO donations (
      id, name, email, amount, message, project_id, project_name,
      transfer_confirmation, status, created_at, verified_at, payment_reference
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const donation of donations) {
    insertDonation.run(
      donation.id,
      donation.name,
      donation.email,
      donation.amount,
      donation.message,
      donation.project_id,
      donation.project_name,
      donation.transfer_confirmation,
      donation.status,
      donation.created_at,
      donation.verified_at,
      donation.payment_reference
    );
  }

  console.log(`✅ Migrated ${donations.length} donations`);
}

async function migrateContactMessages() {
  console.log('Migrating contact messages...');
  
  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching contact messages:', error);
    return;
  }

  if (!messages || messages.length === 0) {
    console.log('No contact messages to migrate');
    return;
  }

  const insertMessage = db.prepare(`
    INSERT OR REPLACE INTO contact_messages (
      id, name, email, subject, message, created_at, responded
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const message of messages) {
    insertMessage.run(
      message.id,
      message.name,
      message.email,
      message.subject,
      message.message,
      message.created_at,
      message.responded ? 1 : 0
    );
  }

  console.log(`✅ Migrated ${messages.length} contact messages`);
}

async function main() {
  try {
    console.log('🚀 Starting Supabase to SQLite migration...\n');

    await initializeSchema();
    await migrateProjects();
    await migrateDonations();
    await migrateContactMessages();

    console.log('\n✅ Migration completed successfully!');
    console.log('🔧 Don\'t forget to update your .env file to set VITE_USE_SUPABASE=false');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
