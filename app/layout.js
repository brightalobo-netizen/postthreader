export const metadata = { title: 'Post Threader', description: 'Schedule Threads posts' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0, fontFamily:'system-ui', background:'#000', color:'#fff'}}>{children}</body>
    </html>
  )
}
