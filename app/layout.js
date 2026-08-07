import "./globals.css"

export const metadata = { 
  title: 'PostThreader', 
  description: 'Schedule Threads like you mean it' 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased relative min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">
        
        {/* SVG Dot Background Grid */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Top Light Glow */}
        <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0" />

        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
