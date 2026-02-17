import { useState } from 'react'
import { Plus, X } from 'lucide-react'

export default function EventForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    event_title: '',
    event_description: '',
    event_date: new Date().toISOString().split('T')[0],
    recorder_name: '',
    source_link: '',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(formData)
    setSubmitting(false)
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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-orange-200 dark:border-gray-700 p-6 mb-6 animate-slide-up">
      <h2 className="text-2xl font-bold mb-4 text-gradient-warm">記錄新的逸事</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">事件標題 *</label>
          <input
            type="text"
            required
            maxLength={50}
            value={formData.event_title}
            onChange={(e) => setFormData({ ...formData, event_title: e.target.value })}
            className="w-full px-4 py-2.5 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            placeholder="今天又發生什麼事了..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">記錄者姓名 *</label>
          <input
            type="text"
            required
            maxLength={50}
            value={formData.recorder_name}
            onChange={(e) => setFormData({ ...formData, recorder_name: e.target.value })}
            className="w-full px-4 py-2.5 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
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
          className="w-full px-4 py-2.5 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
          rows="4"
          placeholder="誰又惹我們楷鈞不開心..."
          maxLength={1000}
        />
        <p className="text-xs text-gray-400 mt-1">
          {formData.event_description.length}/1000 字
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">資料來源 (可選)</label>
        <input
          type="text"
          value={formData.source_link}
          onChange={(e) => setFormData({ ...formData, source_link: e.target.value })}
          className="w-full px-4 py-2.5 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
          placeholder="Discord 訊息連結"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">發生日期 *</label>
        <input
          type="date"
          required
          value={formData.event_date}
          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2.5 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">標籤 (可選)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            className="flex-1 px-4 py-2.5 border-2 border-orange-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            placeholder="例: 爸死、小雞巴化"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            加入
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full flex items-center gap-2 font-medium"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-600 transition-colors"
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
          disabled={submitting}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg shadow-md"
        >
          {submitting ? '送出中...' : '送出記錄'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-semibold py-3 rounded-xl transition-all"
        >
          取消
        </button>
      </div>
    </form>
  )
}
