export default function AdminSidebar() {
  return (
    <nav className="space-y-2">
      <h2 className="text-xl font-bold mb-4">📁 เมนู</h2>
      <ul className="space-y-2">
        {[
          { name: 'แดชบอร์ดรวม', href: '/admin' },
          { name: 'จัดการนักศึกษา', href: '/admin/students' },
          { name: 'Export ข้อมูล', href: '/admin/export' },
          { name: 'สถิติเข้าระบบ', href: '/admin/analytics' },
          { name: 'จัดการแบบสอบถาม', href: '/admin/survey' },
          { name: 'ตั้งค่าระบบ', href: '/admin/settings' },
        ].map((link, i) => (
          <li key={i}>
            <a href={link.href} className="block p-2 rounded hover:bg-green-700">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
