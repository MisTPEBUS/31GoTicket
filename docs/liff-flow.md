<!-- liff-flow.md -->

# LIFF Flow 文件

---

# LIFF 初始化流程

## 初始化

```javascript
await liff.init({
  liffId: "YOUR_LIFF_ID",
});
```

---

# Login Flow

## Step 1

檢查是否登入：

```javascript
if (!liff.isLoggedIn()) {
  liff.login();
}
```

---

## Step 2

取得 Profile

```javascript
const profile = await liff.getProfile();
```

取得：

- userId
- displayName

---

## Step 3

送往後端登入

```javascript
POST / api / liff / login;
```

---

# 活動流程

```text
LIFF Login
↓
個資同意
↓
填寫資料
↓
建立活動
↓
景點打卡 QRCode
↓
完成活動
↓
顯示領獎 QRCode
```

---

# QRCode 流程

## 景點打卡

掃描：

```text
spot_qrcode_token
```

送往：

```http
POST /api/activity/checkin
```

---

# 領獎流程

## 領獎 QRCode

完成活動後：

- 顯示 reward QRCode

工作人員：

- 掃描 reward QRCode
- 進行核銷

---

# LINE Push Message

## 打卡成功

```text
恭喜完成一個景點！
再接再厲！
```

---

## 完成活動

```text
恭喜完成三鶯 Go 活動！
請前往服務台領取獎品！
```

---

# LIFF 注意事項

## 不可取得資料

LIFF 無法取得：

- 電話
- Email

因此必須：

- 使用者自行輸入

---

# 套件

## QRCode 掃描

```bash
npm install html5-qrcode
```

---

# 前端結構

```text
front-end
├─ index.html
├─ activity.html
├─ reward.html
├─ admin.html
├─ assets
├─ js
└─ css
```
