<p align="center">
  <img src="public/Leadspiray_logo.png" width="180" alt="Leadspiray Logo" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Cambria&size=28&duration=4000&color=6366F1&center=true&vCenter=true&width=1000&height=70&lines=Leadspiray+%7C+Smart+Lead+Distribution" alt="Typing SVG" />
</p>

<h2 align="center">Intelligent provider allocation platform</h2>

---

<p align="center">

<img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
<img src="https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" />
<img src="https://img.shields.io/badge/Built%20With-Next.js%20%7C%20Prisma%20%7C%20PostgreSQL-black?style=for-the-badge" />

</p>

---

# Leadspiray

> *Smart lead distribution for service-based businesses.*
> **Leadspiray** is a full-stack lead distribution platform where customers submit service requests and the system intelligently allocates leads to providers based on configurable business rules.
> Designed with **Next.js App Router**, **PostgreSQL**, **Prisma ORM**, and **TypeScript** for speed, reliability, and production-grade concurrency.

---

# ✨ Features

- ⚡ **Smart Allocation** — Round-robin lead distribution with mandatory provider rules
- 🔐 **Idempotent Webhooks** — Duplicate-safe webhook processing via unique event IDs
- 📊 **Live Dashboard** — Real-time provider quota monitoring with Server-Sent Events
- 🌐 **Concurrency Handling** — Advisory locks, serializable transactions, and atomic quota updates
- 🎯 **System Testing Tools** — Built-in QA panel for resetting quotas and stress-testing allocation

---

# 💡 Why This Project?

This project solves a real operational challenge: **how to fairly distribute incoming service requests among multiple providers while respecting business rules, quotas, and concurrency.**

- **Problem**: Manual lead assignment is slow, biased, and doesn't scale.
- **Solution**: An automated allocation engine using PostgreSQL advisory locks and round-robin state persistence.
- **Why it matters**: Providers get a fair share of leads. Customers get faster service. Businesses scale without operational overhead.
- **Who it helps**: Service marketplaces, field service companies, and any platform needing provider-client matching.

---

# 🧩 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js App Router (React 18 / TypeScript) |
| Backend | Next.js API Routes / Prisma ORM |
| Database | PostgreSQL (via Neon for serverless) |
| Styling | Tailwind CSS |
| Real-Time | Server-Sent Events |
| Concurrency | PostgreSQL advisory locks + Serializable isolation |
| Deployment | Vercel |

---

# 📂 Project Structure

```plaintext
leadspiray/
├── app/
│   ├── api/
│   │   ├── dashboard/         # Dashboard data & SSE stream
│   │   ├── leads/             # Lead creation endpoint
│   │   ├── test/              # Concurrent lead generator
│   │   └── webhook/           # Idempotent quota reset webhook
│   ├── dashboard/             # Provider dashboard UI
│   ├── request-service/       # Customer enquiry form
│   ├── test-tools/            # Internal QA/testing panel
│   ├── globals.css            # Global styles & design tokens
│   ├── layout.tsx             # Root layout with navbar & footer
│   └── page.tsx               # Redirect to /request-service
├── lib/
│   ├── allocation.ts          # Lead allocation engine (core logic)
│   ├── allocation-rules.ts    # Provider assignment rules
│   ├── dashboard.ts           # Dashboard data fetching
│   ├── lead-service.ts        # Lead service helpers
│   ├── prisma.ts              # Prisma client singleton
│   └── validation.ts          # Input validation schemas
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data (8 providers, 3 services)
├── public/
│   ├── Leadspiray_logo.png     # Brand logo
│   └── logo.svg               # SVG fallback
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

# ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/Cipher-Shadow-IR/leadspiray.git

# Enter the project directory
cd leadspiray

# Install dependencies
npm install
```

---

# ▶️ Run Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the enquiry form.

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host:5432/leadspiray
```

Copy from `.env.example`:

```bash
cp .env.example .env
```

---

# 📸 Screenshots

```md
Add screenshots / GIFs here
```

- **Request Service** — Customer enquiry form with service type selection
- **Dashboard** — Live provider cards with quota bars and assigned leads
- **Test Tools** — QA panel with quota reset, idempotency test, and concurrency test

---

# 🧠 How It Works

1. **Customer submits** an enquiry via the `/request-service` form (name, phone, city, service type, description).
2. **Leadspiray allocates** the lead to providers using a PostgreSQL-backed transaction:
   - Acquires an advisory lock per service
   - Assigns mandatory providers from business rules
   - Fills remaining slots via round-robin from the fair pool
   - Atomically increments provider quotas
3. **Dashboard updates** in real time via Server-Sent Events — provider cards refresh automatically.
4. **Quota resets** can be triggered via the webhook endpoint (with idempotency protection).

---

# 🚀 Roadmap

- [ ] Email/SMS notifications for new lead assignments
- [ ] Provider acceptance/rejection workflow
- [ ] Historical analytics and lead tracking
- [ ] Admin panel for editing allocation rules
- [ ] Multi-region provider support

---

# 🧪 Testing

```bash
# Run via the built-in test tools at /test-tools
# - Reset provider quotas
# - Test webhook idempotency (3 concurrent calls with same event ID)
# - Generate 10 concurrent leads (stress test)
```

For manual API testing:

```bash
# Create a lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"+91 99999 88888","city":"Delhi","serviceId":1,"description":"Test enquiry"}'

# Reset quotas
curl -X POST http://localhost:3000/api/webhook/reset-quota \
  -H "Content-Type: application/json" \
  -d '{"eventId":"test-123","type":"provider.quota.reset"}'
```

---

# 📈 Future Improvements

- Provider self-service portal with login
- Automated daily quota resets via cron
- Lead scoring and priority queuing
- Analytics dashboard with charts
- Webhook event replay and audit log

---

# 🤝 Contributing

Pull requests are welcome.

Steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

# 📜 License

Apache-2.0 License

---

## 💬 Author

<p align="center">
  <img src="https://img.icons8.com/fluency/48/brain.png" /><br><br>
  <b>Built by Ishaan Ray (Cipher Shadow IR)</b><br>
  <i>"Building Distribution Systems!”</i><br><br>
  <a href="https://github.com/Cipher-Shadow-IR" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Cipher%20Shadow%20IR-181717?style=for-the-badge&logo=github" />
  </a>
</p>

---

# ⭐ Support

If you liked this project:

```md
Give it a star ⭐
```
