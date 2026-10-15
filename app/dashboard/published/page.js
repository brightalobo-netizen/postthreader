import ThreadList from '@/components/ThreadList'

export default function PublishedPage() {
  return (
    <ThreadList
      status="published"
      title="Published"
      subtitle="Threads that are live."
      emptyText="No published threads yet."
      dateField="scheduled_at"
    />
  )
}