import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Persiapan Website Demo',
  description: 'Fondasi website demonstrasi. Konten bisnis belum dipublikasikan.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body>{children}</body></html>
}
