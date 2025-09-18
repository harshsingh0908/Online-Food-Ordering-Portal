-- Migration: Add slug and description columns to menu_items, populate slugs, ensure uniqueness, and add index
ALTER TABLE menu_items ADD COLUMN slug VARCHAR(255);
ALTER TABLE menu_items ADD COLUMN description TEXT NULL;

-- Populate slug with normalized name (lowercase, hyphens, no special chars)
UPDATE menu_items SET slug = LOWER(REPLACE(TRIM(name), ' ', '-'));
-- Ensure uniqueness by appending id if needed
UPDATE menu_items SET slug = CONCAT(slug, '-', id) WHERE slug IN (
  SELECT slug FROM (SELECT slug FROM menu_items GROUP BY slug HAVING COUNT(*)>1) t
);
ALTER TABLE menu_items MODIFY COLUMN slug VARCHAR(255) NOT NULL;
CREATE UNIQUE INDEX uq_menu_items_slug ON menu_items (slug);
