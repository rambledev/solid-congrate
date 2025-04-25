// ✅ app/layout.tsx
import './globals.css'   // ✅ ใช้งานได้แน่นอน


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
