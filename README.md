# DealerDesk

Team beta — spec §3.2 hackathon build.

**One-liner:** Streamline car dealership operations by automating data entry and providing real-time inventory management

**Problem:** Car dealerships struggle with manual data entry, resulting in wasted time and potential errors, leading to decreased profit margins and customer satisfaction

**Solution:** A web-based platform that integrates with existing dealership software to automate data entry, track inventory, and provide real-time analytics

**Build scope:** **DealerDesk – Day‑4‑5 Architecture (≤200 words)**  

**Observed friction (the why):**  
1. Salespeople spend ≈ 15 min per vehicle manually typing VIN, specs, and pricing into the DMS after each test‑drive – a repeatable, error‑prone chore they tolerate because the legacy DMS has no import hook.  
2. Floor‑managers reconcile the showroom count against the DMS nightly, copying spreadsheets and flagging mismatches that often turn into “lost” inventory reports.  

These two manual loops are the *actual* pain points; any “automation” that doesn’t touch them will be ignored.

---

### Tech Stack
- **Frontend:** React 18 + TypeScript, TailwindCSS – quick UI iteration, component reuse.  
- **Backend/API:** Node.js (Express) with TypeScript; PostgreSQL for transactional inventory; Redis for short‑term job queue.  
- **Integration layer:** Apache Camel (or Node‑based ETL) to talk to the dealer’s DMS via its SOAP/REST endpoints (most OEM DMS expose a “Vehicle Import” API).  
- **Hosting:** Docker containers on AWS Fargate (pay‑as‑you‑go, no infra ops).  

### Core Components (3)
1. **Connector Service** – pulls VIN & OBD data from the dealer’s mobile scanner app or webcam OCR, translates to the DMS’s import schema, and pushes via the DMS API.  
2. **Inventory Ledger** – a read‑only replica of the DMS vehicle table; stores status flags, timestamps, and auto‑generated audit trails.  
3. **Analytics Dashboard** – real‑time charts (inventory age, entry‑to‑sale latency) built with Recharts; updates via WebSocket whenever the Connector writes a new record.  

### Top 2 Risks
1. **DMS API heterogeneity / rate limits** – each brand (Ford, GM, etc.) uses a different auth flow; a broken connector stalls the whole pipeline.  
2. **Data quality from OCR / scanner** – mis‑read VINs create silent inventory ghosts that only surface later.  

### Fallback Scope (if risks bite)
- Replace live DMS push with a nightly CSV upload (user drags a file, system validates, then bulk‑upserts).  
- Swap OCR for manual VIN entry (still faster than full DMS typing) while we tighten the scanner integration.  

This plan attacks the exact manual loops dealers *actually* perform today, delivering measurable time savings within the 30‑day MVP window.

Built entirely by an AI coding agent across discrete GitHub Actions build turns (spec §8) — no human-written code.
