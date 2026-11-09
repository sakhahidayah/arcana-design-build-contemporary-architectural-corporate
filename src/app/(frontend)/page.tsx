import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <p className="label">Website Demonstrasi</p>
      <h1>Fondasi siap.<br />Konten menyusul.</h1>
      <p>Website masih dalam tahap pengembangan. Belum ada portofolio atau informasi bisnis yang dipublikasikan.</p>
      <Link href="/admin">Buka CMS</Link>
    </main>
  )
}
