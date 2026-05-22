# 三鶯線文創旅遊打卡系統

## 專案目標

建立一套基於 LINE LIFF 的旅遊景點打卡活動系統。

使用者透過：

- LINE 加好友
- LIFF 登入
- 訂單號碼登錄
- 景點 QRCode 打卡
- 完成活動後領取獎品

提升三鶯線觀光與捷運公車路線曝光。

---

# 技術架構

## Frontend

- HTML
- TailwindCSS
- LIFF SDK
- Html5 QRCode Scanner

## Backend

- ASP.NET Core Web API (.NET 9)
- C#
- JWT Authentication

## Database

- PostgreSQL

---

# 系統流程

## 使用者流程

### 1. 加入 LINE 官方帳號

使用者加入 LINE 好友。

---

### 2. 開啟 LIFF 活動頁

LIFF 取得：

- lineUserId
- displayName

首次登入建立 users 資料。

---

### 3. 同意個資

若不同意：

- 關閉 LIFF

若同意：

- 進入活動登錄

---

### 4. 活動登錄

填寫：

- 姓名
- 電話
- Email
- 訂單號碼

限制：

- 訂單不可重覆
- 活動期間不可重覆參加
- 一次只能一張票

---

### 5. 建立活動紀錄

建立：

- user_activities

設定：

- started_at
- expired_at
- status = pending

---

### 6. 景點打卡

使用者掃描景點 QRCode。

系統：

- 建立 checkin 紀錄
- 計算完成進度
- 推送 LINE 鼓勵訊息

---

### 7. 活動完成

完成所有景點：

- status → completed_unclaimed
- 產生 reward QRCode
- 推送完成通知

---

### 8. 領獎核銷

工作人員：

- 開啟核銷頁
- 掃描 reward QRCode
- 修改領獎狀態

可選：

- 已領獎
- 獎品待補

---

# 狀態流程

```text
pending
↓
completed_unclaimed
├── completed_claimed
└── reward_pending
```

若活動過期：

```text
expired
```

---

# 後台功能

## 景點管理

- 新增景點
- 編輯景點
- QRCode 產生

## 活動管理

- 活動設定
- N 個景點設定

## 會員查詢

- 姓名
- 電話
- Email
- 訂單號碼

## 報表統計

- 未完成
- 已逾期
- 已領獎
- 未領獎
- 獎品待補

---

# 技術規範

## UUID

所有 PK：

```sql
uuid_generate_v4()
```

---

## 日期格式

全部使用：

```text
yyyy-MM-dd HH:mm:ss
```

型態：

```sql
varchar(19)
```

---

# Claude Code 開發規則

## 必須遵守

- 不可使用 any
- API 必須分層
- Repository Pattern
- Service Layer
- DTO Validation
- 全部使用 async/await
- 不可直接 SQL 拼字串

---

# 專案結構

```text
31GoTicket
├─ front-end
├─ back-end
└─ docs
```

<!-- # 系統流程

## step1 使用者加入line群組

→ 使用者掃描LINE官方qrcode或是Line好友分享加入群組
→ 點選加入 取得 LINE Profile

## step2 使用者點選選單註冊

註冊流程
→ 同意活動條款
→ liff取得user_id判斷是否有當天註冊票號
→ 填寫會員資料

- 姓名
- 電話
- Email
- 車票號碼
  → 建立會員資料
  → 建立活動參與紀錄 -->

<!-- 活動流程
→ 查詢活動進度
→ 顯示景點列表
→ 掃描景點 QRCode
→ 驗證 QRCode
→ 建立打卡紀錄
→ 更新活動進度
→ 檢查是否完成全部景點
├─ 未完成 → 返回活動頁
└─ 已完成 → 可領獎

領獎流程
→ 點擊領獎
→ 建立領獎紀錄
→ 顯示核銷碼 / QRCode
→ 工作人員核銷
→ 活動完成 -->
