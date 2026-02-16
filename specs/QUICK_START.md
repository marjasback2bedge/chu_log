# 朋友白癡事件記錄網站 - 快速開始指南

> 給 Claude Code 的實作指南

## 專案目標

建立一個類似 apexlol.info 風格的網站，讓朋友們可以記錄彼此做過的白癡事情，並支援即時更新和互動功能。

## 技術選型

- **前端**: React + Vite + Tailwind CSS
- **後端**: Supabase (PostgreSQL + Realtime)
- **部署**: GitHub Pages
- **語言**: JavaScript/TypeScript (可選)

## 實作步驟

### Step 1: 專案初始化

```bash
# 使用 Vite 建立 React 專案
npm create vite@latest stupid-events-tracker -- --template react
cd stupid-events-tracker
npm install

# 安裝必要套件
npm install @supabase/supabase-js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 安裝其他依賴
npm install date-fns  # 日期處理
npm install lucide-react  # 圖示
```

### Step 2: 設定 Tailwind CSS

更新 `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
}
```

更新 `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自訂樣式 */
body {
  @apply bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100;
}
```

### Step 3: 設定 Supabase

1. **建立 `.env` 檔案**:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **建立 `src/lib/supabaseClient.js`**:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 4: 建立核心元件

#### 4.1 EventCard.jsx - 事件卡片

```javascript
import { Heart } from 'lucide-react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

export default function EventCard({ event, onLike }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {event.person_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            記錄者: {event.recorder_name}
          </p>
        </div>
        <button
          onClick={() => onLike(event.id)}
          className="flex items-center gap-2 bg-pink-100 dark:bg-pink-900 px-3 py-1 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
        >
          <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span className="text-pink-600 dark:text-pink-400 font-semibold">
            {event.likes}
          </span>
        </button>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {event.event_description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {event.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {format(new Date(event.event_date), 'yyyy年MM月dd日', { locale: zhTW })}
      </p>
    </div>
  )
}
```

#### 4.2 EventForm.jsx - 新增事件表單

```javascript
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

export default function EventForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    person_name: '',
    event_description: '',
    event_date: new Date().toISOString().split('T')[0],
    recorder_name: '',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">記錄新的白癡事件 🤦</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">當事人姓名 *</label>
          <input
            type="text"
            required
            value={formData.person_name}
            onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="是誰做了白癡事？"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">記錄者姓名 *</label>
          <input
            type="text"
            required
            value={formData.recorder_name}
            onChange={(e) => setFormData({ ...formData, recorder_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="你的名字"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">事件描述 *</label>
        <textarea
          required
          value={formData.event_description}
          onChange={(e) => setFormData({ ...formData, event_description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
          rows="4"
          placeholder="詳細描述這件白癡事..."
          maxLength="1000"
        />
        <p className="text-xs text-gray-400 mt-1">
          {formData.event_description.length}/1000 字
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">發生日期 *</label>
        <input
          type="date"
          required
          value={formData.event_date}
          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">標籤 (可選)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="例: 飲食、智商感人"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            加入
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          送出記錄
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold py-3 rounded-lg transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}
```

#### 4.3 SearchBar.jsx - 搜尋列

```javascript
import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = "搜尋當事人..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
      />
    </div>
  )
}
```

### Step 5: 建立主要 App.jsx

```javascript
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import EventCard from './components/EventCard'
import EventForm from './components/EventForm'
import SearchBar from './components/SearchBar'
import { Plus, Moon, Sun } from 'lucide-react'

function App() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  // 載入事件
  useEffect(() => {
    fetchEvents()
    
    // 訂閱即時更新
    const subscription = supabase
      .channel('stupid_events_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'stupid_events' }, 
        (payload) => {
          setEvents(prev => [payload.new, ...prev])
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'stupid_events' }, 
        (payload) => {
          setEvents(prev => prev.map(e => 
            e.id === payload.new.id ? payload.new : e
          ))
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 搜尋過濾
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredEvents(
        events.filter(event =>
          event.person_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredEvents(events)
    }
  }, [searchQuery, events])

  // 深色模式
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stupid_events')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching events:', error)
    } else {
      setEvents(data)
    }
    setLoading(false)
  }

  const handleCreateEvent = async (formData) => {
    const { error } = await supabase
      .from('stupid_events')
      .insert([formData])
    
    if (error) {
      console.error('Error creating event:', error)
      alert('新增失敗，請稍後再試')
    } else {
      setShowForm(false)
      // 即時訂閱會自動更新列表
    }
  }

  const handleLike = async (eventId) => {
    const { error } = await supabase
      .rpc('increment_likes', { event_id: eventId })
    
    if (error) {
      console.error('Error liking event:', error)
    }
    // 即時訂閱會自動更新
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              朋友白癡事件簿 🤦‍♂️
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 搜尋與新增按鈕 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="搜尋當事人姓名..."
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            記錄新事件
          </button>
        </div>

        {/* 新增表單 */}
        {showForm && (
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* 事件列表 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">載入中...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? '找不到相關事件' : '還沒有任何記錄，快來新增第一筆吧！'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>朋友間的快樂時光 © 2026</p>
        </div>
      </footer>
    </div>
  )
}

export default App
```

### Step 6: GitHub Pages 部署設定

1. **更新 `vite.config.js`**:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/stupid-events-tracker/',  // 替換成你的 repo 名稱
})
```

2. **建立 `.github/workflows/deploy.yml`**:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### Step 7: Supabase 資料庫設定

在 Supabase SQL Editor 執行:

```sql
-- 建立資料表
CREATE TABLE stupid_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  person_name text NOT NULL CHECK (char_length(person_name) <= 50),
  event_description text NOT NULL CHECK (char_length(event_description) <= 1000),
  event_date date NOT NULL,
  recorder_name text NOT NULL CHECK (char_length(recorder_name) <= 50),
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0 CHECK (likes >= 0),
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 建立統計函數
CREATE OR REPLACE FUNCTION get_event_stats()
RETURNS TABLE (
  person_name text,
  event_count bigint,
  total_likes bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    se.person_name,
    COUNT(*) as event_count,
    SUM(se.likes) as total_likes
  FROM stupid_events se
  GROUP BY se.person_name
  ORDER BY event_count DESC, total_likes DESC;
END;
$$ LANGUAGE plpgsql;

-- 啟用 RLS
ALTER TABLE stupid_events ENABLE ROW LEVEL SECURITY;

-- RLS 政策
CREATE POLICY "Enable read access for all users" 
ON stupid_events FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON stupid_events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for all users" 
ON stupid_events FOR UPDATE 
USING (true);
```

## 完成檢查清單

- [ ] 專案已初始化並安裝所有依賴
- [ ] Tailwind CSS 已正確設定
- [ ] Supabase 專案已建立並取得 API 金鑰
- [ ] 資料庫表格和函數已建立
- [ ] RLS 政策已啟用
- [ ] Realtime 已啟用
- [ ] 所有元件已建立並測試
- [ ] 環境變數已設定
- [ ] GitHub Actions workflow 已設定
- [ ] GitHub Secrets 已新增
- [ ] GitHub Pages 已啟用
- [ ] 網站可正常運作

## 測試項目

1. ✅ 新增事件功能正常
2. ✅ 事件列表正確顯示
3. ✅ 搜尋功能運作
4. ✅ 點讚功能即時更新
5. ✅ 即時訂閱功能正常（開兩個瀏覽器測試）
6. ✅ 深色模式切換正常
7. ✅ 手機版響應式設計正常
8. ✅ 部署到 GitHub Pages 成功

## 額外建議

### 效能優化
- 考慮使用 React.memo 包裝 EventCard
- 實作虛擬滾動處理大量資料
- 加入 loading skeleton

### 功能擴充
- 加入使用者認證（Supabase Auth）
- 支援圖片上傳（Supabase Storage）
- 加入評論功能
- 統計頁面（排行榜）
- 匯出功能

### UI/UX 改進
- 加入動畫效果（Framer Motion）
- Toast 通知（react-hot-toast）
- 確認對話框（刪除、送出前）
- 無限滾動（react-infinite-scroll-component）

## 常見問題

### Q: Supabase 免費額度夠用嗎？
A: 對於朋友間使用絕對夠用。免費方案提供：
- 500MB 資料庫儲存
- 2GB 檔案儲存
- 50,000 個月活躍用戶
- 500MB 傳輸量/月

### Q: 如何保護資料不被惡意使用？
A: 可以考慮：
1. 加入簡單的 Supabase Auth 認證
2. 設定更嚴格的 RLS 政策
3. 在 Supabase Dashboard 設定 API 速率限制

### Q: GitHub Pages 有什麼限制？
A: 主要限制：
- 1GB 容量上限
- 每月 100GB 流量
- 靜態網站（無法執行後端程式碼，但可以呼叫 Supabase API）

## 參考連結

- [Supabase 官方文檔](https://supabase.com/docs)
- [Vite 文檔](https://vitejs.dev/)
- [Tailwind CSS 文檔](https://tailwindcss.com/)
- [React 文檔](https://react.dev/)
- [OpenAPI Spec 文件](./openapi-spec.yaml)
- [完整專案規格](./project-spec.md)
