import "./globals.css"

export const metadata = { 
  title: 'PostThreader', 
  description: 'Schedule Threads like you mean it' 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased relative min-h-screen selection:bg-blue-500 selection:text-white">
        {/* Background Ambient Glows */}
        <div className="glow-top-left" />
        <div className="glow-bottom-right" />
        
        {/* Main Page Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
