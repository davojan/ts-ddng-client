# Context

## Terms

### Expense Category

A user-defined hierarchical category used to classify expense records in Drebedengi. An expense category has an identifier, a name, an optional parent expense category, visibility metadata, and ordering metadata.

### Expense Category Tree

The hierarchy formed by expense categories through their parent-child relationship.

### Expense Category Delete Conflict

A domain error raised when an expense category cannot be deleted because the server reports dependent linked objects, such as child categories or expense records.

### Expense Category CRUD API

A high-level API that exposes separate create, read, update, and delete operations for expense categories and does not leak Drebedengi transport-level save semantics such as `client_id` and `server_id`.

### Expense Category List

The high-level read model for expense categories is a flat list where each category carries its optional `parentId`. Tree construction is a consumer concern, not the default API response shape.

### Expense Category Validation

Expense category input validation is split between the client and Drebedengi. The client validates deterministic input invariants, such as non-empty names, required identifiers for updates, and self-parenting. Drebedengi remains authoritative for referential rules, such as parent existence and delete dependencies.

### Expense Category Integration Test Data

Integration tests create and mutate only test-owned expense categories with a recognizable generated name prefix. Cleanup deletes those categories after each run, and tests remain opt-in so ordinary test runs do not mutate the demo account.

### Expense Category Update

Expense category updates are replace-style for the fields supported by the high-level API. Callers send the full editable category state, and patch-style merging is left to callers that first fetch the current category.

### Expense Category Description

Expense categories include a textual description returned by Drebedengi. The high-level model exposes it as `description`, and create/update inputs may provide it.

### Income Source

A user-defined hierarchical source used to classify income records in Drebedengi. An income source has an identifier, a name, an optional parent income source, visibility metadata, and ordering metadata.

### Income Source Tree

The hierarchy formed by income sources through their parent-child relationship.

### Income Source Delete Conflict

A domain error raised when an income source cannot be deleted because the server reports dependent linked objects, such as child income sources or income records.

### Income Source CRUD API

A high-level API that exposes separate create, read, update, and delete operations for income sources and does not leak Drebedengi transport-level save semantics such as `client_id` and `server_id`.

### Income Source List

The high-level read model for income sources is a flat list where each source carries its optional `parentId`. Tree construction is a consumer concern, not the default API response shape.

### Income Source Validation

Income source input validation is split between the client and Drebedengi. The client validates deterministic input invariants, such as non-empty names, required identifiers for updates, and self-parenting. Drebedengi remains authoritative for referential rules, such as parent existence and delete dependencies.

### Income Source Integration Test Data

Integration tests create and mutate only test-owned income sources with a recognizable generated name prefix. Cleanup deletes those sources after each run, and tests remain opt-in so ordinary test runs do not mutate the demo account.

### Income Source Update

Income source updates are replace-style for the fields supported by the high-level API. Callers send the full editable source state, and patch-style merging is left to callers that first fetch the current income source.

### Income Source Description

Income sources include a textual description returned by Drebedengi. The high-level model exposes it as `description`, and create/update inputs may provide it.

### Place

A user-defined hierarchical money location used by Drebedengi records, such as a cash wallet, bank account, or card. Use `Place` for this domain concept even when a user would casually say account.

### Place Tree

The hierarchy formed by places through their parent-child relationship.

### Place Delete Conflict

A domain error raised when a place cannot be deleted because the server reports dependent linked objects, such as child places or records.

### Place CRUD API

A high-level API that exposes separate create, read, update, and delete operations for places and does not leak Drebedengi transport-level save semantics such as `client_id` and `server_id`.

### Place List

The high-level read model for places is a flat list where each place carries its optional `parentId`. Tree construction is a consumer concern, not the default API response shape.

### Place Validation

Place input validation is split between the client and Drebedengi. The client validates deterministic input invariants, such as non-empty names, required identifiers for updates, and self-parenting. Drebedengi remains authoritative for referential rules, such as parent existence and delete dependencies.

### Place Integration Test Data

Integration tests create and mutate only test-owned places with a recognizable generated name prefix. Cleanup deletes those places after each run, and tests remain opt-in so ordinary test runs do not mutate the demo account.

### Place Update

Place updates are replace-style for the fields supported by the high-level API. Callers send the full editable place state, but a place cannot be converted between ordinary place and debt account through the high-level update API.

### Place Flags

Place metadata such as debt-account, auto-hide, credit-card, purse user, and icon fields belongs to the place read model. Debt-account, auto-hide, and icon metadata is writable when Drebedengi persists it; credit-card and purse-user metadata remain server-owned.

### Debt Account

A Drebedengi place representing debt with an external entity rather than ordinary owned money. Drebedengi exposes this as duty metadata.

### Currency

A user-defined money unit used by Drebedengi records and balances. A currency has an identifier, a display name, a course, a code, visibility metadata, autoupdate metadata, and a default-currency flag.

### Default Currency

The primary currency for a Drebedengi family. Exactly one currency is intended to be default at a time.

### Currency CRUD API

A high-level API that exposes separate create, read, update, and delete operations for currencies and does not leak Drebedengi transport-level save semantics such as `client_id` and `server_id`.

### Currency List

The high-level read model for currencies is a flat list of currency definitions rather than a hierarchy.

### Currency Validation

Currency input validation is split between the client and Drebedengi. The client validates deterministic input invariants, such as non-empty names and required autoupdate codes. Drebedengi remains authoritative for referential rules, uniqueness constraints, and default-currency side effects.

### Currency Integration Test Data

Integration tests create and mutate only test-owned non-default currencies with a recognizable generated name prefix. Cleanup deletes those currencies after each run, and tests remain opt-in so ordinary test runs do not mutate the demo account.

### Currency Update

Currency updates are replace-style for the fields supported by the high-level API. Callers send the full editable currency state, and patch-style merging is left to callers that first fetch the current currency.

### Finance Operation Amount

High-level finance operation APIs expose user-entered positive amounts. Drebedengi record signs are transport details: expenses and outgoing move/exchange legs may be stored as negative records, but CRUD models normalize amounts to positive values.

### Finance Operation Identity

High-level finance operation APIs expose one operation identifier. For single-record income and expense operations it is the Drebedengi record id. For two-record move and exchange operations it is the positive destination leg record id; the paired record id is an internal transport detail.

### Finance Operation Update

Finance operation updates are replace-style for the fields supported by the high-level API. Callers send the full editable operation state. For two-record move and exchange operations, the client fetches the paired Drebedengi record internally and updates both records together.

### Finance Operation Type

Finance operation update APIs keep the existing operation type fixed. Changing an expense into an income, move, or exchange is modeled as delete plus create rather than as an update.

### Exchange Operation

An exchange operation is a currency conversion inside one place. Drebedengi represents it as two linked records in the same place with different currencies; it is not a cross-place transfer.

### Finance Operation List

High-level per-type operation list APIs reuse Drebedengi record-list filters and force the relevant operation type internally. The filter model remains shared with `getRecordList`, while returned items are typed as expenses, incomes, moves, or exchanges.

### Finance Operation Create

Finance operation create APIs return one high-level operation identifier. For single-record income and expense operations this is the created record id. For two-record move and exchange operations this is the positive destination leg record id.
