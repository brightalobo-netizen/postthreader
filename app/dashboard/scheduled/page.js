import ThreadList from '@/components/ThreadList'

export default function ScheduledPage() {
  return (
    <ThreadList
      status="scheduled"
      title="Scheduled"
      subtitle="Threads queued to post automatically."
      emptyText="Nothing scheduled. Pick a date and time on a draft to queue it."
      dateField="scheduled_at"
    />
  )
}