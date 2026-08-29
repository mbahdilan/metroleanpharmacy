-- Restructures `products` for the pharmacy catalog: drops dead
-- perfume-legacy columns, renames top_notes -> active_ingredient, adds
-- storage/side-effect fields. The live table currently has 0 rows, so
-- this is a schema-only change -- no data migration needed.
-- Run this once in the Supabase SQL editor. Safe to re-run.

alter table products drop column if exists scent_family;
alter table products drop column if exists middle_notes;
alter table products drop column if exists base_notes;
alter table products drop column if exists image_url;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'products' and column_name = 'top_notes'
  ) then
    alter table products rename column top_notes to active_ingredient;
  end if;
end $$;

alter table products add column if not exists storage_instructions text;
alter table products add column if not exists side_effects text;

-- Category browsing is being dropped in favor of the existing Drug Class
-- (therapeutic_class) filter, which already works without a curated table.
alter table products drop column if exists category_id;
alter table products drop column if exists expiry_date;
drop table if exists categories;
