-- SQLite Schema Migration from Supabase
-- This file contains the core schema for the Lynda Mbah Foundation database

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- Contact Messages Table
CREATE TABLE contact_messages (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    responded INTEGER DEFAULT 0 CHECK (responded IN (0, 1))
);

-- Projects Table
CREATE TABLE projects (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    target REAL NOT NULL,
    raised REAL DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'upcoming')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Donations Table
CREATE TABLE donations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    amount REAL NOT NULL,
    message TEXT,
    project_id TEXT,
    project_name TEXT,
    transfer_confirmation TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'verified', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME,
    payment_reference TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_donations_project_id ON donations(project_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX idx_donations_created_at ON donations(created_at);

-- Create triggers for updated_at timestamp
CREATE TRIGGER update_projects_timestamp 
    AFTER UPDATE ON projects
    BEGIN
        UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
