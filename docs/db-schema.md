# Database Schema md

# users 使用者資料表

儲存 LIFF 登入的 LINE 使用者資料。

| 欄位名稱     | 型態                | 說明              |
| ------------ | ------------------- | ----------------- |
| id           | uuid PK             | 系統 UUID         |
| line_user_id | varchar(100) UNIQUE | LINE UserID       |
| name         | varchar(100)        | default LIFF 名稱 |
| phone        | varchar(30) NULL    | 電話              |
| email        | varchar(255) NULL   | Email             |
| created_at   | varchar(19)         | 建立時間          |
| updated_at   | varchar(19)         | 更新時間          |

---

# activity_spots 活動景點表

管理員建立打卡景點。

| 欄位名稱     | 型態                | 說明         |
| ------------ | ------------------- | ------------ | ------------------- |
| id           | uuid PK             | UUID         |
| name         | varchar(100)        | 景點名稱     |
| description  | text                | 景點說明     |
| address      | varchar(255)        | 地址         |
| qrcode_token | varchar(255) UNIQUE | QRCode Token | base64(random uuid) |
| image_url    | varchar(255) NULL   | 景點圖片     |
| sort_order   | int                 | 排序         |
| is_enabled   | boolean             | 是否啟用     |
| created_at   | varchar(19)         | 建立時間     |
| updated_at   | varchar(19)         | 更新時間     |

---

# activity_campaigns 活動主表

可支援未來多活動。

| 欄位名稱            | 型態         | 說明           |
| ------------------- | ------------ | -------------- |
| id                  | uuid PK      | UUID           |
| title               | varchar(100) | 活動名稱       |
| description         | text         | 活動說明       |
| required_spot_count | int          | 需要完成景點數 |
| start_date          | varchar(19)  | 活動開始       |
| end_date            | varchar(19)  | 活動結束       |
| is_enabled          | boolean      | 是否啟用       |
| created_at          | varchar(19)  | 建立時間       |
| updated_at          | varchar(19)  | 更新時間       |

---

# campaign_spots 活動景點關聯表

活動對應哪些景點。

| 欄位名稱    | 型態        | 說明     |
| ----------- | ----------- | -------- |
| id          | uuid PK     | UUID     |
| campaign_id | uuid FK     | 活動ID   |
| spot_id     | uuid FK     | 景點ID   |
| created_at  | varchar(19) | 建立時間 |

---

# user_activities 使用者活動參加表

核心活動資料表。

| 欄位名稱          | 型態                | 說明             |
| ----------------- | ------------------- | ---------------- | ------------------- |
| id                | uuid PK             | UUID             |
| user_id           | uuid FK             | 使用者ID         |
| campaign_id       | uuid FK             | 活動ID           |
| order_no          | varchar(100) UNIQUE | 訂單號碼         |
| participant_name  | varchar(100)        | 姓名             |
| participant_phone | varchar(30)         | 電話             |
| participant_email | varchar(255)        | Email            |
| agree_privacy     | boolean             | 是否同意個資     |
| started_at        | varchar(19)         | 活動開始時間     |
| expired_at        | varchar(19)         | 活動結束時間     |
| completed_at      | varchar(19) NULL    | 完成時間         |
| reward_qrcode     | varchar(255) NULL   | 領獎QRCode Token | base64(random uuid) |
| status            | varchar(30)         | 活動狀態         |
| created_at        | varchar(19)         | 建立時間         |
| updated_at        | varchar(19)         | 更新時間         |

status VARCHAR(30) NOT NULL
CHECK (
status IN (
'pending',
'expired',
'completed_unclaimed',
'completed_claimed',
'reward_pending'
)
)

---

# user_activity_checkins 使用者打卡紀錄表

每次掃描景點 QRCode 都建立紀錄。
UNIQUE(user_activity_id, spot_id)

| 欄位名稱         | 型態        | 說明       |
| ---------------- | ----------- | ---------- |
| id               | uuid PK     | UUID       |
| user_activity_id | uuid FK     | 活動參加ID |
| spot_id          | uuid FK     | 景點ID     |
| checked_in_at    | varchar(19) | 打卡時間   |
| created_at       | varchar(19) | 建立時間   |

---

# reward_redemptions 領獎核銷表

服務人員核銷紀錄。

| 欄位名稱         | 型態             | 說明       |
| ---------------- | ---------------- | ---------- |
| id               | uuid PK          | UUID       |
| user_activity_id | uuid FK          | 活動參加ID |
| reward_status    | varchar(30)      | 領獎狀態   |
| redeemed_by      | varchar(100)     | 核銷人員   |
| redeemed_at      | varchar(19) NULL | 核銷時間   |
| remark           | text NULL        | 備註       |
| created_at       | varchar(19)      | 建立時間   |

---

# admin_users 管理員帳號表

後台登入。

| 欄位名稱      | 型態                | 說明     |
| ------------- | ------------------- | -------- |
| id            | uuid PK             | UUID     |
| account       | varchar(100) UNIQUE | 帳號     |
| password_hash | varchar(255)        | 密碼     |
| name          | varchar(100)        | 名稱     |
| role          | varchar(30)         | 權限     |
| is_enabled    | boolean             | 是否啟用 |
| created_at    | varchar(19)         | 建立時間 |

---

# line_push_logs LINE推播紀錄

儲存推播訊息。

| 欄位名稱     | 型態        | 說明              |
| ------------ | ----------- | ----------------- |
| id           | uuid PK     | UUID              |
| user_id      | uuid FK     | 使用者            |
| message_type | varchar(50) | 訊息類型          |
| message      | text        | 推播內容          |
| is_success   | BOOLEAN     | 是否成功          |
| response     | TEXT        | LINE API response |
| pushed_at    | varchar(19) | 推播時間          |
| created_at   | varchar(19) | 建立時間          |

---

# 狀態設計

## user_activities.status

| 狀態                | 說明     |
| ------------------- | -------- |
| pending             | 未完成   |
| expired             | 已逾期   |
| completed_unclaimed | 未領獎   |
| completed_claimed   | 已領獎   |
| reward_pending      | 獎品待補 |

---

# 關聯圖

users
└── user_activities
├── user_activity_checkins
└── reward_redemptions

activity_campaigns
└── campaign_spots
└── activity_spots

---

# UUID 預設規則

所有資料表 UUID 使用 PostgreSQL 自動產生。

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
