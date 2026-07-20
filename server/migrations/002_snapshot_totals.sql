alter table finance_snapshots
add column if not exists total bigint not null default 0;

update finance_snapshots snapshot
set total = totals.amount
from (
  select snapshot_id, coalesce(sum(amount), 0) as amount
  from finance_rows
  group by snapshot_id
) totals
where snapshot.id = totals.snapshot_id;
