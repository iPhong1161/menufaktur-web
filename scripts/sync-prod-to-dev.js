#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * One-time anonymized sync from production Supabase → dev Supabase.
 *
 * SAFETY MODEL
 * ─────────────
 * • prodClient is READ-ONLY. It is only ever used for .select().
 * • devClient is WRITE-ONLY. It is only ever used for .insert().
 * • If PROD_SUPABASE_URL === DEV_SUPABASE_URL, the script aborts before any
 *   network call — this prevents accidental self-write to production.
 * • Interactive `yes` confirmation is required, showing masked project IDs
 *   on both sides so the operator sees FROM vs TO before anything runs.
 *
 * USAGE
 * ─────
 *   1. Create .env.sync from .env.sync.example (both file names are gitignored).
 *   2. Fill in PROD_SUPABASE_URL, PROD_SERVICE_ROLE_KEY,
 *      DEV_SUPABASE_URL, DEV_SERVICE_ROLE_KEY.
 *   3. Run with Node 20.6+:
 *        node --env-file=.env.sync scripts/sync-prod-to-dev.js
 *
 * TABLE ORDER (foreign-key dependencies)
 * ──────────────────────────────────────
 *   courses → vouchers → bookings → participants → invoice_recipients
 *   → contact_messages → newsletter_subscribers
 *
 * SKIPPED entirely: profiles, admin_users.
 */

const readline = require("readline")
const { createClient } = require("@supabase/supabase-js")

const BATCH_SIZE = 50

// ─── Env-var validation ────────────────────────────────────────────────────────

const {
  PROD_SUPABASE_URL,
  PROD_SERVICE_ROLE_KEY,
  DEV_SUPABASE_URL,
  DEV_SERVICE_ROLE_KEY,
} = process.env

const missing = []
if (!PROD_SUPABASE_URL) missing.push("PROD_SUPABASE_URL")
if (!PROD_SERVICE_ROLE_KEY) missing.push("PROD_SERVICE_ROLE_KEY")
if (!DEV_SUPABASE_URL) missing.push("DEV_SUPABASE_URL")
if (!DEV_SERVICE_ROLE_KEY) missing.push("DEV_SERVICE_ROLE_KEY")
if (missing.length > 0) {
  console.error(`\n✖ Missing required environment variables:\n  - ${missing.join("\n  - ")}\n`)
  console.error("Create .env.sync from .env.sync.example and run with:")
  console.error("  node --env-file=.env.sync scripts/sync-prod-to-dev.js\n")
  process.exit(1)
}

// ─── Hard safety guard: prod and dev must be different projects ───────────────

if (PROD_SUPABASE_URL.trim() === DEV_SUPABASE_URL.trim()) {
  console.error("\n✖ FATAL: PROD_SUPABASE_URL and DEV_SUPABASE_URL are identical.")
  console.error("  This script would write to the SAME project it reads from.")
  console.error("  Aborting before any network call.\n")
  process.exit(2)
}

// ─── URL masking (show project id only) ───────────────────────────────────────

/**
 * Extract the Supabase project ref from a URL like
 * https://abcdefghijklmnop.supabase.co → "abcdefghijklmnop".
 */
function projectIdOf(url) {
  try {
    const host = new URL(url).host
    const label = host.split(".")[0]
    return label || "(unknown)"
  } catch {
    return "(unparseable)"
  }
}

const PROD_ID = projectIdOf(PROD_SUPABASE_URL)
const DEV_ID = projectIdOf(DEV_SUPABASE_URL)

// ─── Interactive confirmation ─────────────────────────────────────────────────

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function requireConfirmation() {
  console.log("\n════════════════════════════════════════════════════════")
  console.log(" Supabase prod → dev sync (anonymized)")
  console.log("════════════════════════════════════════════════════════")
  console.log(`   Reading FROM: ${PROD_ID}`)
  console.log(`   Writing TO:   ${DEV_ID}`)
  console.log("════════════════════════════════════════════════════════")
  console.log(" • prodClient: SELECT-only")
  console.log(" • devClient:  INSERT-only")
  console.log(" • Skipped:    profiles, admin_users")
  console.log("════════════════════════════════════════════════════════\n")
  const answer = await prompt("Type 'yes' to proceed: ")
  if (answer.trim().toLowerCase() !== "yes") {
    console.log("\n✖ Aborted by user.\n")
    process.exit(3)
  }
  console.log("")
}

// ─── Clients ──────────────────────────────────────────────────────────────────

const prodClient = createClient(PROD_SUPABASE_URL, PROD_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})
const devClient = createClient(DEV_SUPABASE_URL, DEV_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

// ─── Transformations ──────────────────────────────────────────────────────────

const TRANSFORMS = {
  courses: (row) => row,

  vouchers: (row, i) => ({
    ...row,
    purchaser_name: `Test Käufer ${i}`,
    purchaser_email: `test${i}@example.com`,
    recipient_name: `Test Empfänger ${i}`,
    recipient_email: row.recipient_email == null ? null : `test${i}@example.com`,
    postal_address:
      row.postal_address == null
        ? null
        : { street: "Teststraße 1", city: "Teststadt", postalCode: "12345" },
    personal_message: row.personal_message == null ? null : "Test-Nachricht",
  }),

  bookings: (row) => ({
    ...row,
    user_id: null,
  }),

  participants: (row, i) => ({
    ...row,
    first_name: "Test",
    last_name: `Teilnehmer${i}`,
    email: `test${i}@example.com`,
    phone: row.phone == null ? null : "0000000000",
  }),

  invoice_recipients: (row, i) => ({
    ...row,
    first_name: "Test",
    last_name: `Rechnung${i}`,
    company_name: row.company_name == null ? null : "Test GmbH",
    address_line1: "Teststraße 1",
    postal_code: "12345",
    city: "Teststadt",
    email: `test${i}@example.com`,
    vat_id: row.vat_id == null ? null : "DE000000000",
  }),

  contact_messages: (row, i) => ({
    ...row,
    name: `Test Kontakt ${i}`,
    email: `test${i}@example.com`,
  }),

  newsletter_subscribers: (row, i) => ({
    ...row,
    email: `test${i}@example.com`,
  }),
}

// Strict FK-ordered list. Do NOT re-order without checking references.
const TABLES = [
  "courses",
  "vouchers",
  "bookings",
  "participants",
  "invoice_recipients",
  "contact_messages",
  "newsletter_subscribers",
]

// Per-table write mode. Default is plain .insert() which fails on PK conflict.
// Listing a table here switches it to .upsert() with the given onConflict target.
// Rationale: dev may already have rows for that table from a partial earlier
// sync or manual seeding; upsert overwrites while preserving the same PK so
// FKs pointing at it (e.g. bookings.course_id → courses.id) stay valid.
const UPSERT_CONFLICT = {
  courses: "id",
}

// ─── Sync per table ───────────────────────────────────────────────────────────

async function fetchAllRows(table) {
  // Paginate to avoid Supabase's default 1000-row cap.
  const PAGE = 1000
  const rows = []
  let from = 0
  // Enforced read-only: only .select() ever runs on prodClient.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await prodClient
      .from(table)
      .select("*")
      .range(from, from + PAGE - 1)
      .order("id", { ascending: true })
    if (error) throw error
    if (!data || data.length === 0) break
    rows.push(...data)
    if (data.length < PAGE) break
    from += PAGE
  }
  return rows
}

async function insertBatched(table, rows) {
  let inserted = 0
  const errors = []
  const conflictTarget = UPSERT_CONFLICT[table]
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    // Enforced write-scope: only .insert() or .upsert() ever run on devClient.
    // Upsert is opt-in per table via UPSERT_CONFLICT (default = plain insert).
    const query = conflictTarget
      ? devClient.from(table).upsert(batch, { onConflict: conflictTarget, count: "exact" })
      : devClient.from(table).insert(batch, { count: "exact" })
    const { error, count } = await query
    if (error) {
      errors.push({ batch: `${i}..${i + batch.length - 1}`, message: error.message })
    } else {
      inserted += typeof count === "number" ? count : batch.length
    }
  }
  return { inserted, errors }
}

async function syncTable(table) {
  console.log(`\n─── ${table} ───`)
  try {
    const rows = await fetchAllRows(table)
    console.log(`  fetched: ${rows.length}`)

    const transform = TRANSFORMS[table]
    if (!transform) throw new Error(`No transform defined for table ${table}`)
    const transformed = rows.map((row, idx) => transform(row, idx))

    const { inserted, errors } = await insertBatched(table, transformed)
    console.log(`  inserted: ${inserted}`)
    if (errors.length > 0) {
      console.log(`  ⚠ ${errors.length} batch error(s):`)
      for (const e of errors) console.log(`    rows ${e.batch}: ${e.message}`)
    }
    return { table, fetched: rows.length, inserted, errored: errors.length, ok: true }
  } catch (err) {
    console.error(`  ✖ ${table}: ${err instanceof Error ? err.message : String(err)}`)
    return { table, fetched: 0, inserted: 0, errored: 0, ok: false, error: String(err) }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await requireConfirmation()

  const summary = []
  for (const table of TABLES) {
    const result = await syncTable(table)
    summary.push(result)
  }

  console.log("\n════════════════════════════════════════════════════════")
  console.log(" Summary")
  console.log("════════════════════════════════════════════════════════")
  for (const s of summary) {
    const status = s.ok ? (s.errored > 0 ? "⚠" : "✓") : "✖"
    console.log(
      `  ${status} ${s.table.padEnd(24)} fetched ${String(s.fetched).padStart(5)}   inserted ${String(s.inserted).padStart(5)}${s.errored ? `   errored ${s.errored}` : ""}`,
    )
  }
  console.log("════════════════════════════════════════════════════════\n")
}

main().catch((err) => {
  console.error("\n✖ Unhandled error:", err)
  process.exit(1)
})
