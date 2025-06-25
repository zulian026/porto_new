// app/admin/layout.tsx
export const metadata = {
  title: "Admin",
  description: "Halaman admin login",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-black">{children}</body>
    </html>
  );
}
