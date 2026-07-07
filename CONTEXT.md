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
