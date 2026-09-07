const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/components/dashboard/Sidebar.tsx',
  'src/app/dashboard/absensi/page.tsx',
  'src/app/dashboard/alumni/page.tsx',
  'src/app/dashboard/arus-keuangan/page.tsx',
  'src/app/dashboard/cabang/page.tsx',
  'src/app/dashboard/database/page.tsx',
  'src/app/dashboard/input-nilai/page.tsx',
  'src/app/dashboard/jurnal/page.tsx',
  'src/app/dashboard/kartu-qr/page.tsx',
  'src/app/dashboard/kelas/page.tsx',
  'src/app/dashboard/kurikulum/page.tsx',
  'src/app/dashboard/layout.tsx',
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/pengaturan/page.tsx',
  'src/app/dashboard/rapor/page.tsx',
  'src/app/dashboard/riwayat-jurnal/page.tsx',
  'src/app/dashboard/riwayat-spp/page.tsx',
  'src/app/dashboard/siswa/page.tsx',
  'src/app/dashboard/spp/page.tsx',
  'src/app/dashboard/website/page.tsx',
  'src/app/page.tsx',
  'src/app/globals.css'
];

const cleanups = [
  { from: /dark:border-blue-800(\/[0-9]+)?/g, to: 'dark:border-emerald-800$1' },
  { from: /dark:border-blue-700/g, to: 'dark:border-emerald-700' },
  { from: /dark:hover:border-blue-800/g, to: 'dark:hover:border-emerald-800' },
  { from: /hover:border-blue-800/g, to: 'hover:border-emerald-800' },
  { from: /text-blue-900/g, to: 'text-emerald-950' },
  { from: /text-blue-950/g, to: 'text-emerald-950' },
  { from: /text-blue-100/g, to: 'text-emerald-100' },
  { from: /bg-blue-400\/10/g, to: 'bg-emerald-400/10' },
  { from: /fill-blue-600/g, to: 'fill-amber-400' },
  { from: /fill-blue-500/g, to: 'fill-amber-400' },
  { from: /fill-blue-400/g, to: 'fill-amber-400' },
  { from: /dark:fill-blue-400/g, to: 'dark:fill-amber-400' },
  { from: /dark:text-sky-300/g, to: 'dark:text-emerald-300' },
  { from: /dark:text-sky-400/g, to: 'dark:text-emerald-400' },
  { from: /border-blue-800/g, to: 'border-emerald-800' },
  { from: /border-blue-700/g, to: 'border-emerald-700' },
  { from: /bg-blue-400/g, to: 'bg-emerald-500' },
  { from: /text-blue-400/g, to: 'text-emerald-400' },
  { from: /text-blue-300/g, to: 'text-emerald-300' },
];

for (const relPath of targetFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  for (const c of cleanups) {
    content = content.replace(c.from, c.to);
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Cleaned up: ${relPath}`);
  }
}
console.log('Cleanup finished!');
