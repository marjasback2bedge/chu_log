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

  useEffect(() => {
    fetchEvents()

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

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredEvents(
        events.filter(event =>
          event.event_title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setFilteredEvents(events)
    }
  }, [searchQuery, events])

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
    }
  }

  const handleLike = async (eventId) => {
    const { error } = await supabase
      .rpc('increment_likes', { event_id: eventId })

    if (error) {
      console.error('Error liking event:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors">
      <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm border-b border-orange-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-lg shadow-md">
                📖
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gradient-warm">
                曲楷鈞公逸事
              </h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-orange-100 dark:bg-gray-700 hover:bg-orange-200 dark:hover:bg-gray-600 transition-all hover:scale-105"
            >
              {darkMode ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-orange-500" />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="搜尋事件標題..."
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-lg shadow-md"
          >
            <Plus className="w-5 h-5" />
            記錄新事件
          </button>
        </div>

        {showForm && (
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl animate-bounce-subtle mb-3">⏳</div>
            <p className="text-orange-400 dark:text-orange-300 font-medium">載入中...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">{searchQuery ? '🔍' : '📝'}</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery ? '找不到相關事件，換個關鍵字試試？' : '還沒有任何記錄，快來新增第一筆逸事吧！'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  )
}

export default App
