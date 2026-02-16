import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = "搜尋事件標題..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
      />
    </div>
  )
}
