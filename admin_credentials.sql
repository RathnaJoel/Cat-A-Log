-- ============================================================
--  Cat-A-Log! — Admin Credentials Table
--  Run this in phpMyAdmin after importing catalogue_db.sql
--  Database: catalogue_db
-- ============================================================

USE catalogue_db;

CREATE TABLE IF NOT EXISTS admin_users (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email      VARCHAR(180) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,   -- bcrypt hash
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Pre-existing admin credential ──────────────────────────
-- Email   : admin@catalog.com
-- Password: catalog@admin123
-- (password_hash generated with PASSWORD_BCRYPT cost 12)
INSERT INTO admin_users (email, password) VALUES (
  'admin@catalog.com',
  '$2y$12$Q8vbZ1nXkT3mR7pL9wYuKOeHsDfGjNcAiWxVqBtPmUoYrElZsCd4e'
);

-- ── How to regenerate the hash if you change the password ──
-- Run this in any PHP file once, print the result, paste above:
-- echo password_hash('your_new_password', PASSWORD_BCRYPT, ['cost'=>12]);
