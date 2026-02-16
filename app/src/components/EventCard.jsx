import { Heart } from 'lucide-react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

export default function EventCard({ event, onLike }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-orange-100 dark:border-gray-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gradient-warm">
            {event.event_title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ✍️ {event.recorder_name}
          </p>
        </div>
        <button
          onClick={() => onLike(event.id)}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 px-3 py-1.5 rounded-full hover:scale-110 transition-all duration-200 shadow-sm"
        >
          <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          <span className="text-rose-600 dark:text-rose-400 font-semibold text-sm">
            {event.likes}
          </span>
        </button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">
        {event.event_description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {event.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 text-xs px-2.5 py-1 rounded-lg font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        📅 {format(new Date(event.event_date), 'yyyy年MM月dd日', { locale: zhTW })}
      </p>
    </div>
  )
}
