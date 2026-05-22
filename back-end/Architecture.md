# Backend Architecture

## Tech Stack

- .NET 9 Web API
- Dapper
- PostgreSQL
- Swagger

---

# Architecture Pattern

使用：

- Controller
- Service
- Repository

三層架構。

---

# Folder Structure

```txt
back-end/
├── Controllers/
├── Services/
├── Repositories/
├── DTOs/
├── Entities/
├── Infrastructure/
├── Middleware/
├── Helpers/
├── Constants/
├── Extensions/
├── Migrations/
└── Program.cs
```

---

# Controller Rules

Controller 僅負責：

- request validation
- response formatting
- 呼叫 service

不可：

- 寫 SQL
- 寫 business logic
- 操作 transaction

---

# Service Rules

Service 負責：

- business logic
- transaction
- workflow

例如：

- 活動完成判定
- QRCode 驗證
- 狀態切換
- LINE 推播

---

# Repository Rules

Repository 僅負責：

- SQL
- CRUD
- database access

不可：

- 寫 business logic
- 呼叫第三方 API

---

# Database Rules

- PostgreSQL
- UUID Primary Key
- 使用 gen_random_uuid()
- snake_case naming

---

# Migration Rules

所有 schema 異動：

必須新增 migration。

不可：

- 直接修改 production database
- 修改舊 migration

---

# API Response Rules

所有 API 必須統一：

```json
{
  "success": true,
  "message": "success",
  "data": {},
  "errorCode": ""
}
```

---

# Auth Rules

使用：

- JWT
- LIFF ID Token

---

# QRCode Rules

QRCode 不可直接信任。

必須：

- 驗證 token
- 驗證活動狀態
- 驗證是否重覆打卡

---

# Status Rules

活動狀態：

- 未完成
- 已逾期
- 未領獎
- 已領獎
- 獎品待補

狀態切換統一由 Service 控制。

---

# Logging Rules

必須記錄：

- API Error
- Login
- Reward Redeem
- QRCode Scan

---

# Security Rules

- 不可相信前端資料
- 所有驗證由後端處理
- 所有權限由 JWT 判定
- 所有 QRCode 必須驗證
