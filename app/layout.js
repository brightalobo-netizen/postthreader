import "./globals.css"

export const metadata = { title: 'Post Threader', description: 'Schedule Threads posts' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
