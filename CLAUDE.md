# Claude Code Rules

## General

- 所有功能開發前先提出 plan
- 未經確認不可直接大量修改
- 所有 API 必須 RESTful
- 所有 response 必須統一格式
- 所有資料表主鍵使用 uuid
- uuid 由 PostgreSQL uuid_generate_v4() 產生
- 不可由 DTO 傳入 id

---

## Backend Rules

- 使用 .NET 9 Web API
- 使用 Dapper
- 不使用 Entity Framework
- Repository pattern
- Service layer required
- Controller 不可直接操作 SQL

---

## Database Rules

- 使用 PostgreSQL
- 所有時間欄位使用 varchar
- 格式：
  yyyy-MM-dd HH:mm:ss
- 時區固定 UTC+8

---

## Frontend Rules

- 使用 Html + TailwindCSS
- 不使用 React
- 使用 fetch API
- 所有 API endpoint 集中管理

---

## Naming Rules

- API:
  /api/activity/join

- Table:
  snake_case

- C#:
  PascalCase

---

## Safety Rules

- 不可刪除 docs/
- 修改 migration 前需說明
- 不可重構已完成功能
