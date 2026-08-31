-- Confirms UPDATE works against a real, already-existing product row.
-- Runs inside a transaction and rolls back at the end, so no actual
-- product data is changed. Safe to re-run anytime in the Supabase SQL editor.

begin;

create temporary table _test_target as
select id, name, price, units_in_stock
from products
order by created_at
limit 1;

select 'BEFORE' as stage, * from _test_target;

update products p
set price = p.price + 1,
    units_in_stock = p.units_in_stock + 1
from _test_target t
where p.id = t.id
returning 'AFTER' as stage, p.id, p.name, p.price, p.units_in_stock;

rollback;
