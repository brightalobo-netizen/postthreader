import ThreadList from '@/components/ThreadList'

export default function DraftsPage() {
  return (
    <ThreadList
      status="draft"
      title="Drafts"
      subtitle="Threads you're still writing."
      emptyText="No drafts yet. Start a thread and it will show up here."
      dateField="scheduled_at"
    />
  )
}