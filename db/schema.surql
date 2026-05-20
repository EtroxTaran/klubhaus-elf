-- SUPERSEDED 2026-05-19 by ADR-0021 (docs/10-Architecture/09-Decisions).
-- SurrealDB is no longer the system of record. The authoritative schema is
-- now Drizzle/PostgreSQL in packages/db/src/schema.ts. Kept for history only;
-- do not apply. SurrealDB may return only as an optional additive
-- realtime/graph engine behind the ADR-0023 RealtimeTransport interface.
DEFINE TABLE IF NOT EXISTS club SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS name ON TABLE club TYPE string;
DEFINE FIELD IF NOT EXISTS city ON TABLE club TYPE string;
DEFINE FIELD IF NOT EXISTS created_at ON TABLE club TYPE datetime DEFAULT time::now();
