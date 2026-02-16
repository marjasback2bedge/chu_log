# 朋友白癡事件記錄網站 - 專案規格文件

## 專案概述

一個讓朋友們記錄彼此做過的白癡事情的網站，參考 apexlol.info 的風格，支援多人協作新增內容。

## 技術架構

### 前端
- **Host**: GitHub Pages
- **框架**: React (使用 Vite 建置)
- **樣式**: Tailwind CSS
- **狀態管理**: React Hooks

### 後端
- **BaaS**: Supabase
- **資料庫**: PostgreSQL (Supabase 提供)
- **認證**: Supabase Auth (可選)

## 功能需求

### 核心功能

1. **瀏覽事件列表**
   - 顯示所有記錄的白癡事件
   - 支援分頁或無限滾動
   - 顯示事件詳情：當事人、事件描述、日期、記錄者

2. **新增事件**
   - 表單欄位：
     - 當事人姓名 (必填)
     - 事件描述 (必填)
     - 發生日期 (必填)
     - 記錄者姓名 (必填)
     - 標籤/分類 (可選)
   - 即時新增到列表

3. **搜尋與篩選**
   - 按當事人搜尋
   - 按日期範圍篩選
   - 按標籤篩選

4. **互動功能**
   - 點讚/按讚功能
   - 顯示每個事件的點讚數
   - (可選) 評論功能

### UI/UX 要求

- **響應式設計**: 支援手機、平板、桌面
- **深色模式**: 提供淺色/深色主題切換
- **動畫效果**: 新增事件時的過渡動畫
- **即時更新**: 有人新增事件時自動刷新列表

## 資料庫結構

### Table: `stupid_events`

| 欄位名稱 | 資料型別 | 說明 | 限制 |
|---------|---------|------|------|
| id | uuid | 主鍵 | PRIMARY KEY, DEFAULT gen_random_uuid() |
| person_name | text | 當事人姓名 | NOT NULL |
| event_description | text | 事件描述 | NOT NULL |
| event_date | date | 事件發生日期 | NOT NULL |
| recorder_name | text | 記錄者姓名 | NOT NULL |
| tags | text[] | 標籤陣列 | DEFAULT '{}' |
| likes | integer | 點讚數 | DEFAULT 0 |
| created_at | timestamp | 建立時間 | DEFAULT now() |
| updated_at | timestamp | 更新時間 | DEFAULT now() |

### 索引
```sql
CREATE INDEX idx_person_name ON stupid_events(person_name);
CREATE INDEX idx_event_date ON stupid_events(event_date DESC);
CREATE INDEX idx_created_at ON stupid_events(created_at DESC);
```

### Row Level Security (RLS)
```sql
-- 允許所有人讀取
CREATE POLICY "Enable read access for all users" 
ON stupid_events FOR SELECT 
USING (true);

-- 允許所有人新增
CREATE POLICY "Enable insert access for all users" 
ON stupid_events FOR INSERT 
WITH CHECK (true);

-- 只允許更新 likes 欄位
CREATE POLICY "Enable update likes for all users" 
ON stupid_events FOR UPDATE 
USING (true)
WITH CHECK (true);
```

## API 規格 (Supabase Client)

### 1. 取得所有事件

```javascript
// GET /events (概念上)
const { data, error } = await supabase
  .from('stupid_events')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50);
```

**回應格式:**
```json
[
  {
    "id": "uuid",
    "person_name": "小明",
    "event_description": "把醬油當成可樂喝了一大口",
    "event_date": "2026-02-15",
    "recorder_name": "小華",
    "tags": ["飲食", "智商感人"],
    "likes": 42,
    "created_at": "2026-02-16T10:30:00Z",
    "updated_at": "2026-02-16T10:30:00Z"
  }
]
```

### 2. 新增事件

```javascript
// POST /events (概念上)
const { data, error } = await supabase
  .from('stupid_events')
  .insert([
    {
      person_name: "小明",
      event_description: "把醬油當成可樂喝了一大口",
      event_date: "2026-02-15",
      recorder_name: "小華",
      tags: ["飲食", "智商感人"]
    }
  ])
  .select();
```

### 3. 更新點讚數

```javascript
// PATCH /events/:id/likes (概念上)
const { data, error } = await supabase
  .rpc('increment_likes', { event_id: 'uuid' });
```

**需要建立的 PostgreSQL Function:**
```sql
CREATE OR REPLACE FUNCTION increment_likes(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stupid_events
  SET likes = likes + 1,
      updated_at = now()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;
```

### 4. 搜尋事件

```javascript
// GET /events?person=小明 (概念上)
const { data, error } = await supabase
  .from('stupid_events')
  .select('*')
  .ilike('person_name', '%小明%')
  .order('created_at', { ascending: false });
```

### 5. 即時訂閱

```javascript
// WebSocket connection (Supabase Realtime)
const subscription = supabase
  .channel('stupid_events_changes')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'stupid_events' 
    }, 
    (payload) => {
      console.log('新事件:', payload.new);
      // 更新 UI
    }
  )
  .subscribe();
```

## 環境設定

### 環境變數 (`.env`)
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase 專案設定步驟

1. 前往 https://supabase.com 註冊帳號
2. 建立新專案
3. 在 SQL Editor 執行以下 SQL：

```sql
-- 建立資料表
CREATE TABLE stupid_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name text NOT NULL,
  event_description text NOT NULL,
  event_date date NOT NULL,
  recorder_name text NOT NULL,
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- 建立索引
CREATE INDEX idx_person_name ON stupid_events(person_name);
CREATE INDEX idx_event_date ON stupid_events(event_date DESC);
CREATE INDEX idx_created_at ON stupid_events(created_at DESC);

-- 建立點讚函數
CREATE OR REPLACE FUNCTION increment_likes(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE stupid_events
  SET likes = likes + 1,
      updated_at = now()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- 啟用 RLS
ALTER TABLE stupid_events ENABLE ROW LEVEL SECURITY;

-- 設定政策
CREATE POLICY "Enable read access for all users" 
ON stupid_events FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON stupid_events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update likes for all users" 
ON stupid_events FOR UPDATE 
USING (true);
```

4. 在 Settings > API 取得 Project URL 和 anon/public key
5. 在 Database > Replication 啟用 Realtime (針對 stupid_events 表)

## 專案結構

```
stupid-events-tracker/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── EventCard.jsx          # 單一事件卡片
│   │   ├── EventList.jsx          # 事件列表
│   │   ├── EventForm.jsx          # 新增事件表單
│   │   ├── SearchBar.jsx          # 搜尋列
│   │   └── ThemeToggle.jsx        # 主題切換按鈕
│   ├── lib/
│   │   └── supabaseClient.js      # Supabase 初始化
│   ├── hooks/
│   │   ├── useEvents.js           # 事件資料 hook
│   │   └── useRealtime.js         # 即時訂閱 hook
│   ├── App.jsx                    # 主應用程式
│   ├── main.jsx                   # 入口點
│   └── index.css                  # 全域樣式
├── .env.example                   # 環境變數範例
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 部署流程

### GitHub Pages 部署

1. **設定 vite.config.js**
```javascript
export default {
  base: '/your-repo-name/',  // 你的 repo 名稱
  build: {
    outDir: 'dist'
  }
}
```

2. **建立 GitHub Actions workflow** (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

3. **在 GitHub repo 設定 Secrets**
   - Settings > Secrets and variables > Actions
   - 新增 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`

4. **啟用 GitHub Pages**
   - Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

## 安全性考量

1. **Supabase RLS**: 已設定基本的讀取和新增權限
2. **API Key**: anon key 可以公開，因為有 RLS 保護
3. **輸入驗證**: 前端需驗證必填欄位和字數限制
4. **XSS 防護**: React 預設會轉義輸出，但事件描述需注意

## 可選功能 (Phase 2)

- [ ] 使用者認證 (Supabase Auth)
- [ ] 圖片上傳 (Supabase Storage)
- [ ] 評論系統
- [ ] 通知功能 (有人提到你時)
- [ ] 統計頁面 (誰最常出現)
- [ ] 匯出功能 (PDF/CSV)

## 效能優化

- 使用 React.memo 減少不必要的重新渲染
- 實作虛擬滾動處理大量資料
- 圖片使用 lazy loading
- Supabase query 使用適當的 limit 和分頁

## 測試策略

- 單元測試: Vitest
- E2E 測試: Playwright (可選)
- 測試重點:
  - 表單驗證
  - API 呼叫
  - 即時更新功能

## 開發工具建議

- **IDE**: VS Code
- **Extensions**: 
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Supabase Snippets

## 預估時程

- 專案設定與 Supabase 配置: 1-2 小時
- 基本 CRUD 功能: 3-4 小時
- UI/UX 優化: 2-3 小時
- 即時功能與互動: 2-3 小時
- 測試與部署: 1-2 小時

**總計**: 約 10-15 小時

## 參考資源

- [Supabase 官方文檔](https://supabase.com/docs)
- [Vite 官方文檔](https://vitejs.dev/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [React 官方文檔](https://react.dev/)
