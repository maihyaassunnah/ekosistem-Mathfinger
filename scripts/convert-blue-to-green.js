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

const replacements = [
  // Gradients
  { from: /from-blue-600 to-sky-500/g, to: 'from-emerald-600 to-teal-500' },
  { from: /from-blue-700 to-sky-600/g, to: 'from-emerald-700 to-teal-600' },
  { from: /from-blue-500 to-sky-400/g, to: 'from-emerald-500 to-teal-400' },
  { from: /to-sky-500/g, to: 'to-teal-500' },
  { from: /from-blue-600/g, to: 'from-emerald-600' },
  { from: /from-blue-500/g, to: 'from-emerald-500' },
  { from: /to-blue-600/g, to: 'to-emerald-600' },
  { from: /to-blue-700/g, to: 'to-emerald-700' },
  
  // Shadows and Rings
  { from: /shadow-blue-500\/([0-9]+)/g, to: 'shadow-emerald-500/$1' },
  { from: /shadow-blue-600\/([0-9]+)/g, to: 'shadow-emerald-600/$1' },
  { from: /ring-blue-500\/([0-9]+)/g, to: 'ring-emerald-500/$1' },
  { from: /ring-blue-500/g, to: 'ring-emerald-500' },
  { from: /ring-blue-600/g, to: 'ring-emerald-600' },
  { from: /focus:ring-blue-500/g, to: 'focus:ring-emerald-500' },
  { from: /focus:ring-blue-600/g, to: 'focus:ring-emerald-600' },
  { from: /focus:border-blue-500/g, to: 'focus:border-emerald-500' },
  { from: /focus:border-blue-600/g, to: 'focus:border-emerald-600' },

  // Backgrounds
  { from: /bg-blue-600/g, to: 'bg-emerald-600' },
  { from: /bg-blue-700/g, to: 'bg-emerald-700' },
  { from: /bg-blue-800/g, to: 'bg-emerald-800' },
  { from: /bg-blue-500/g, to: 'bg-emerald-600' },
  { from: /bg-blue-50\/([0-9]+)/g, to: 'bg-emerald-50/$1' },
  { from: /bg-blue-50/g, to: 'bg-emerald-50' },
  { from: /bg-blue-100/g, to: 'bg-emerald-100' },
  { from: /bg-blue-200/g, to: 'bg-emerald-200' },
  { from: /bg-blue-900/g, to: 'bg-emerald-900' },
  { from: /bg-blue-950\/([0-9]+)/g, to: 'bg-emerald-950/$1' },
  { from: /bg-blue-950/g, to: 'bg-emerald-950' },

  // Hover backgrounds
  { from: /hover:bg-blue-700/g, to: 'hover:bg-emerald-700' },
  { from: /hover:bg-blue-600/g, to: 'hover:bg-emerald-600' },
  { from: /hover:bg-blue-50\/([0-9]+)/g, to: 'hover:bg-emerald-50/$1' },
  { from: /hover:bg-blue-50/g, to: 'hover:bg-emerald-50' },
  { from: /hover:bg-blue-100/g, to: 'hover:bg-emerald-100' },

  // Texts
  { from: /text-blue-600/g, to: 'text-emerald-600' },
  { from: /text-blue-700/g, to: 'text-emerald-700' },
  { from: /text-blue-800/g, to: 'text-emerald-800' },
  { from: /text-blue-500/g, to: 'text-emerald-600' },
  { from: /text-blue-400/g, to: 'text-emerald-400' },
  { from: /text-blue-300/g, to: 'text-emerald-300' },
  { from: /text-blue-200/g, to: 'text-emerald-200' },
  { from: /hover:text-blue-600/g, to: 'hover:text-emerald-600' },
  { from: /hover:text-blue-700/g, to: 'hover:text-emerald-700' },

  // Borders
  { from: /border-blue-600/g, to: 'border-emerald-600' },
  { from: /border-blue-500/g, to: 'border-emerald-500' },
  { from: /border-blue-400/g, to: 'border-emerald-400' },
  { from: /border-blue-300/g, to: 'border-emerald-300' },
  { from: /border-blue-200/g, to: 'border-emerald-200' },
  { from: /border-blue-100\/([0-9]+)/g, to: 'border-emerald-100/$1' },
  { from: /border-blue-100/g, to: 'border-emerald-100' },
  { from: /border-blue-900/g, to: 'border-emerald-900' },
  { from: /border-blue-950/g, to: 'border-emerald-950' },
];

let filesChanged = 0;
let totalReplacements = 0;

for (const relPath of targetFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping missing file: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  for (const r of replacements) {
    const matches = content.match(r.from);
    if (matches) {
      totalReplacements += matches.length;
      content = content.replace(r.from, r.to);
    }
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    filesChanged++;
    console.log(`✅ Updated: ${relPath}`);
  }
}

console.log(`\n🎉 Completed! Changed ${filesChanged} files with ${totalReplacements} total replacements.`);
