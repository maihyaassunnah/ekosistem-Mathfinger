# SYSTEM ARCHITECTURE DOCUMENT

**Nama Project:** Management System & Public Landing Page – Les Mathfingers  
**Versi:** 1.0  
**Status:** Approved for Technical Implementation  

---

## 1. High-Level Architecture Overview

Aplikasi Les Mathfingers menggunakan arsitektur **Monolithic-Modular / Decoupled Headless Approach** dengan kerangka **Next.js (App Router)** sebagai Full-Stack Framework. Arsitektur ini dipilih untuk meminimalisir *overhead* infrastruktur, mempercepat latensi antar layer, dan mempermudah pengelolaan aplikasi multi-tenant / multi-cabang.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  [ Public Visitors ]          [ Admin Cabang / Tutor ]         [ Super Admin ]    |
|   (Landing Page / Form)          (Mobile/Tablet/Desktop)          (Desktop Dashboard)|
+-----------------------------------------+-----------------------------------------+
                                          |
                                    HTTPS / WSS
                                          |
+-----------------------------------------v-----------------------------------------+
|                              EDGE / INGRESS LAYER                                 |
|                                                                                   |
|                   Cloudflare CDN / Vercel Edge / Nginx Reverse Proxy              |
|                   (SSL Termination, Rate Limiting, DDoS Protection)              |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|                                APPLICATION LAYER                                  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                           NEXT.JS FULL-STACK SERVER                         |  |
|  |                                                                             |  |
|  |  +-----------------------+  +-----------------------+  +-----------------+  |  |
|  |  | Public Web & Form SSR |  | Admin Dashboard React |  | Next.js API     |  |  |
|  |  | (SEO Optimized)       |  | (Client Components)   |  | Routes / TRPC   |  |  |
|  |  +-----------------------+  +-----------------------+  +--------+--------+  |  |
|  |                                                                 |           |  |
|  |  +--------------------------------------------------------------v---------+  |  |
|  |  |                         CORE BUSINESS LOGIC                            |  |  |
|  |  |                                                                        |  |  |
|  |  |  [Auth/RBAC Guard]  [Multi-Branch Tenant Middleware]  [QR Scanner Engine]|  |  |
|  |  |  [Billing Engine]   [Attendance Handler]          [Notification Queue] |  |  |
|  |  +--------------------------------------------------------------+---------+  |  |
|  +-----------------------------------------------------------------|-----------+  |
+--------------------------------------------------------------------|--------------+
                                                                     |
+--------------------------------------------------------------------v--------------+
|                            THIRD-PARTY INTEGRATION LAYER                          |
|                                                                                   |
|    +------------------------+  +------------------------+  +------------------+   |
|    | Payment Gateway API    |  | WhatsApp Gateway API   |  | Object Storage   |   |
|    | (Midtrans / Xendit)    |  | (Fonnte / Wablas API)  |  | (AWS S3 / Cloud) |   |
|    +------------------------+  +------------------------+  +------------------+   |
+--------------------------------------------------------------------^--------------+
                                                                     |
+--------------------------------------------------------------------v--------------+
|                                DATA STORAGE LAYER                                 |
|                                                                                   |
|  +-------------------------------------+  +------------------------------------+  |
|  | Relational DB (PostgreSQL / MySQL)  |  | Cache & Queue Engine (Redis)       |  |
|  | Data Siswa, Cabang, SPP, Absensi    |  | Session, Token, & Scheduled Jobs   |  |
|  +-------------------------------------+  +------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Technology Stack & Component Specifications

| Layer / Component | Technology | Rationale / Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend & Server** | **Next.js 14+ (React)** | SSR & SSG untuk SEO Landing Page; React Client Components untuk Dashboard Interaktif. |
| **Programming Language** | **TypeScript** | *Type safety* penuh dari basis data hingga UI guna menghindari *runtime error*. |
| **UI Framework & Styling** | **Tailwind CSS + Shadcn UI** | Komponen UI profesional, modern, ringan, dan bebas dari tampilan visual yang berlebihan. |
| **Database ORM** | **Prisma ORM** / **Drizzle** | Schema migration yang aman (*type-safe queries*) dan integrasi mulus dengan TypeScript. |
| **Database Storage** | **PostgreSQL** | Tangguh untuk query relational kompleks (Multi-Cabang, Rekapitulasi SPP, Presensi). |
| **Cache & Queue** | **Redis** | Menyimpan *session token*, pengolahan *rate limiting*, dan antrean WhatsApp notification. |
| **Payment Gateway** | **Midtrans Snap / Xendit** | Biaya per transaksi tanpa iuran bulanan; mendukung QRIS, Virtual Account, & E-Wallet. |
| **WhatsApp Service** | **Fonnte API / Wablas** | Integrasi API pesan WhatsApp otomatis untuk reminder tagihan SPP & receipt. |
| **QR Engine** | **HTML5-QRCode Library** | *Client-side scanner* memanfaatkan kamera *device* langsung di browser tanpa butuh aplikasi tambahan. |

---

## 3. Subsystem Architectural Modules

### 3.1 Multi-Branch Tenant Isolation Module
Sistem **TIDAK** menggunakan *multi-database strategy*, melainkan **Single Database dengan Column-Based Multi-Tenancy (`branch_id`)**:
* **Data Scoping Middleware:** Setiap request dari pengguna dengan role `branch_admin` atau `tutor` akan dilewati oleh *Tenant Isolation Middleware* yang secara otomatis menyuntikkan klausa `WHERE branch_id = user.branch_id` pada setiap query data.
* **Global Access Scoping:** Hanya `super_admin` yang dapat melakukan bypass filter `branch_id` untuk menarik data konsolidasi seluruh cabang.

### 3.2 Dual-Mode Attendance System Architecture

```
                          +-------------------------+
                          |   ATTENDANCE TRIGGER    |
                          +------------+------------+
                                       |
                  +--------------------+--------------------+
                  |                                         |
                  v                                         v
       [ OPSI 1: QR CODE SCAN ]                  [ OPSI 2: MANUAL INPUT ]
                  |                                         |
       1. Kamera capture QR                      1. Tutor buka list kelas
       2. Client dekripsi Payload                2. Centang status (H/I/S/A)
       3. Send payload + Timestamp               3. Submit form data
                  |                                         |
                  +--------------------+--------------------+
                                       |
                                       v
                     +-----------------------------------+
                     |    BACKEND ATTENDANCE VALIDATOR   |
                     |                                   |
                     |  - Match student_id & branch_id   |
                     |  - Check duplicate on same date   |
                     |  - Deduct quota / update count    |
                     +-----------------+-----------------+
                                       |
                                       v
                     +-----------------------------------+
                     |   DATABASE ATTENDANCE RECORDING   |
                     +-----------------------------------+
```

### 3.3 Automated Financial & Payment Pipeline

```
+------------------+     Cron Job (Setiap Tgl 1)    +---------------------+
| System Scheduler | -----------------------------> | Auto-Generate SPP   |
+------------------+                                | Invoices per Student|
                                                    +----------+----------+
                                                               |
                                                               v
+------------------+     Send Notification          +---------------------+
| WhatsApp Engine  | <----------------------------- | H-3 Notification    |
| (Fonnte/Wablas)  |                                | + Payment Link      |
+--------+---------+                                +---------------------+
         |
         | Parent Clicks Payment Link
         v
+------------------+     Process Payment            +---------------------+
| Payment Gateway  | -----------------------------> | Webhook Handler     |
| (Midtrans/Xendit)|                                | (Verify Signature)  |
+------------------+                                +----------+----------+
                                                               |
                                                               v
+------------------+     Update Status = PAID       +---------------------+
| WhatsApp Engine  | <----------------------------- | Update Database     |
| (Instant Receipt)|                                | & Ledger Record     |
+------------------+                                +---------------------+
```

---

## 4. Security, Authentication, & Access Control

1. **Authentication:**
   * Berbasis **JWT (JSON Web Token)** / **NextAuth.js (Auth.js)** disimpan pada `HttpOnly Cookie` yang terenkripsi untuk mencegah serangan *Cross-Site Scripting (XSS)*.
2. **Role-Based Access Control (RBAC):**
   * *Permission Matrix* dieksekusi di level API Middleware sebelum payload diproses oleh Controller.
3. **QR Code Security:**
   * Payload pada QR Code Siswa menggunakan string terenkripsi atau *Hashed Identifier* untuk mencegah manipulasi ID siswa secara manual.
4. **Payment Webhook Verification:**
   * Setiap *callback/webhook* dari Payment Gateway wajib memverifikasi **Signature Key** (SHA512) guna memastikan request berasal dari gateway resmi, bukan modifikasi pihak ketiga.

---

## 5. Deployment & Infrastructure Setup (Coolify VPS & Custom Domain)

```
[ Custom Domain: domainanda.com ]
          |
          v
+-------------------------------------------------------------+
|                     VPS HOST (COOLIFY PAAS)                 |
|                                                             |
|  +-------------------------------------------------------+  |
|  |   Traefik Reverse Proxy (Auto SSL via Let's Encrypt)   |  |
|  +---------------------------+---------------------------+  |
|                              |                              |
|               +--------------+--------------+               |
|               |                             |               |
|               v                             v               |
|  +--------------------------+  +--------------------------+  |
|  | Next.js App Container    |  | PostgreSQL DB Container  |  |
|  | (Docker Node Standalone) |──| (Coolify 1-Click Service)|  |
|  +--------------------------+  +--------------------------+  |
|               |                                             |
|               v                                             |
|  +--------------------------+                               |
|  | Redis Container (Queue)  |                               |
|  | (Coolify 1-Click Service)|                               |
|  +--------------------------+                               |
+-------------------------------------------------------------+
```

* **Production Environment:** Self-Hosted VPS dengan **Coolify** (PaaS). Menjalankan aplikasi Next.js dalam container Docker `standalone` yang ringan dan efisien.
* **Domain & SSL Management:** Traefik terintegrasi otomatis menangani *routing* domain kustom dan pembaruan sertifikat SSL Let's Encrypt (HTTPS otomatis).
* **Database & Cache Service:** PostgreSQL 16 & Redis berjalan sebagai 1-Click Managed Resources di Coolify dengan data persisten tersimpan di Docker volume VPS lokal (tanpa biaya langganan cloud database eksternal).
* **File & Image Assets:** Local Docker persistent volume atau S3-compatible storage (seperti Cloudflare R2 / MinIO di VPS).

