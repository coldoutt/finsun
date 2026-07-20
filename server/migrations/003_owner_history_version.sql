alter table user_finance_state
add column if not exists owner_history_version integer not null default 0;
