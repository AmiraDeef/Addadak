تمام جداً! سأقوم الآن بتحديث ملف الـ `README.md` لتعديل المخطط المعماري (Architecture Diagram) وشرح النظام بحيث يعكس بوضوح:

1. **استخدام قاعدة بيانات موحدة واحدة (Unified Shared Database)** لجميع الخدمات.
2. **إبراز دور الـ Data Collector** كـ ETL Pipeline يتصل بشركات المرافق المختلفة (كهرباء، غاز، مياه) ويقوم بسحب وتجميع البيانات وتخزينها مباشرة داخل قاعدة البيانات الموحدة.

إليك التحديث النهائي للملف:

```markdown:README.md

```

# ⚡ Addadak (عدّادك)

### *Smarter Utilities, Better Life*

An enterprise-grade, microservices-driven **Smart Utility Management & ML-powered Forecasting Ecosystem** for Electricity, Gas, and Water consumption.

---

## 📌 Executive Summary

**Addadak (عدّادك)** is a full-stack, distributed utility management platform engineered to revolutionize how smart meters for **Electricity, Gas, and Water** are monitored, forecasted, and billed.

The ecosystem addresses critical energy challenges across three core dimensions:

* **Individual Consumers:** Gain real-time visibility over multi-utility meter consumption, tier boundaries, and instant bill payment.
* **Business & Commercial Users:** Track usage across multiple branch locations with aggregated analytics to eliminate unexpected utility overheads.
* **Utility Providers:** Minimize estimated billing errors, curb delayed collections, and mitigate peak-demand grid stress through intelligent demand analytics.

---

## 🏗️ System Architecture

Addadak is structured using a **Modular Microservices Architecture** supported by a **Centralized Shared Database** and an automated multi-source **Data Ingestion Collector Engine**.

### 📐 Architecture Diagram

```text
+-----------------------+      +-----------------------+      +-----------------------+
|  Electricity Company  |      |      Gas Company      |      |     Water Company     |
|   Provider Service    |      |   Provider Service    |      |   Provider Service    |
+-----------+-----------+      +-----------+-----------+      +-----------+-----------+
            |                              |                              |
            +------------------------------+------------------------------+
                                           | (External Utility Data APIs)
                                           v
                            +-----------------------------+
                            |   Data Collector Engine     |
                            | (ETL, Validation & Ingest)  |
                            +--------------+--------------+
                                           |
                                           v
                            ===============================
                            |   UNIFIED SHARED DATABASE   |
                            |          (MongoDB)          |
                            ===============================
                                           ^
      +---------------------+--------------+--------------+---------------------+
      |                     |                             |                     |
+-----+-----+         +-----+-----+                 +-----+-----+         +-----+-----+
|   Auth    |         |  Metrics  |                 |  Forecast |         |   Wallet  |
|  Server   |         |  Server   |                 |  Server   |         |   Server  |
+-----------+         +-----------+                 +-----------+         +-----+-----+
      ^                     ^                             ^                     |
      |                     |                             |             [ Stripe Payment ]
      +---------------------+--------------+--------------+                     |
                                           |                                    v
                                  +--------+--------+                  +-----------------+
                                  |  API Gateway /  | <--------------> | Alerts Service  |
                                  |  React Client   |                  | (Redis/BullMQ)  |
                                  +-----------------+                  +-----------------+

```

---

## 🔄 Core Services & Pipeline Breakdown

### 📥 1. Multi-Provider Data Collector Pipeline

The **Data Collector Service** acts as the central ingestion engine. It periodically connects to multiple external utility provider endpoints (Electricity, Water, and Gas provider servers / simulators), extracts reading batches, sanitizes & validates the payloads, and persists them into the **Unified Database**.

### ⚙️ 2. Core Microservices Suite (Shared DB Model)

All microservices communicate through defined API contracts while reading/writing from the single source of truth database:

* 🔑 **Auth Server (`User Core`):** User identity management, authentication, role-based access control, and account profile handling.
* 📊 **Metrics Server (`Metrics`):** Reads utility readings (Electricity, Gas, Water) ingested by the Collector, calculates consumption tiers, and builds historical usage logs.
* 🤖 **Forecast Server (`Forecast`):** Machine Learning microservice running predictive models against database historical data to estimate future consumption and bill projections.
* 💳 **Wallet & Billing Server (`Payment`):** Instant online billing management integrated with **Stripe API** for secure digital payments.
* 🔔 **Notification Server (`Alerts`):** Event-driven alerting framework powered by **Redis & BullMQ** for low-balance warnings, emergency notifications, and tier-threshold breach alerts.

---

## ✨ Key Features

* **Multi-Utility Dashboard:** Centralized real-time overview for Electricity, Gas, and Water meters.
* **Automated Data Collector Engine:** Continuous background ingestion from multiple utility provider servers into a single unified database.
* **AI/ML Usage & Bill Forecasting:** Predictive analytics that estimate next month’s consumption and expected cost before bill arrival.
* **Dynamic Tier & Consumption Tracking:** Visual badges and progress indicators for national utility tariff tiers.
* **Appliance-Level Insights:** Granular breakdown of individual device consumption patterns.
* **Instant Online Payments:** One-click bill settlement via integrated digital wallet and Stripe payments.
* **Proactive Emergency & Balance Alerts:** Automated notifications for critical balance drops or unusual usage spikes.

---

## 🛠️ Tech Stack

| Domain | Technologies & Libraries |
| --- | --- |
| **Frontend** | React.js, Tailwind CSS / UI Component Framework, Chart.js / Recharts, Axios |
| **Backend Microservices** | Node.js, Express.js, RESTful APIs, JWT Authentication |
| **Machine Learning** | Python, NumPy, Pandas, Scikit-Learn |
| **Database & Caching** | Centralized MongoDB (Mongoose ORM), Redis |
| **Message Queue & Async** | BullMQ |
| **Payment Gateway** | Stripe API |
| **DevOps & Infra** | Docker, Nginx, GitHub Actions CI/CD |

---

## 📂 Repository Structure

```text
Addadak/
├── BE/                           # Backend Microservices Ecosystem
│   ├── AuthServer/               # Authentication & User Management Service
│   ├── ForecastServer/           # Python & Node ML Prediction Engine
│   ├── MetricsServer/            # Utility Consumption & Meter Data Service
│   ├── notificationServer/       # Redis-backed Alerting & Notification Service
│   ├── walletServer/             # Billing, Invoicing & Stripe Integration
│   ├── Data Collector/           # Multi-Provider Ingestion, Transformation & Schedulers
│   └── Electricity_Company_Fake_Server/ # Mock External Utility Provider API
├── FE/
│   └── addadak/                  # React.js Single Page Application
├── Paper Work/                   # Architecture diagrams, System Documentation
├── logs/                         # Centralized System Error & Event Logs
└── README.md

```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your local environment:

* **Node.js** (v18.x or later)
* **Python** (v3.9+ for ML Forecasting engine)
* **MongoDB** (Single instance or MongoDB Atlas cluster)
* **Redis Server** (For notification queues)
* **Docker & Docker Compose** *(Optional, recommended)*

### Local Installation & Setup

1. **Clone the repository:**

```bash
   git clone [https://github.com/your-username/Addadak.git](https://github.com/your-username/Addadak.git)
   cd Addadak
   

```

2. **Configure Environment Variables:**
Create a `.env` file inside each microservice directory under `BE/` pointing to the single **MongoDB Connection String**, along with service-specific JWT secrets, Stripe Keys, and Redis Host.
3. **Run Backend Microservices & Collector:**
Navigate into each microservice directory and install dependencies:

```bash
   # 1. Run Data Collector
   cd BE/"Data Collector"
   npm install
   npm run dev

   # 2. Run Services (Auth, Metrics, Wallet, Notification)
   cd ../AuthServer
   npm install
   npm run dev

   # 3. For ML Forecast Server:
   cd ../ForecastServer
   pip install -r requirements.txt
   python app.py
   

```

4. **Run Frontend Application:**

```bash
   cd FE/addadak
   npm install
   npm start
   

```

The dashboard will be available at `http://localhost:3000`.

---

## 🔮 Future Roadmap

* [ ] **Direct Hardware Ingestion:** Direct MQTT telemetry protocols for physical IoT smart meters into the Data Collector.
* [ ] **Cross-Platform Mobile Application:** React Native mobile client for iOS and Android.
* [ ] **Unified Multi-Utility Bill Payment:** Single-transaction settlement across all three utilities simultaneously.
* [ ] **Smart Tariff Optimizer:** AI recommendations to schedule heavy appliance usage during off-peak hours.

---

## 👥 Team & Acknowledgments

### Project Team (Team Members)

* **Toka Mamdouh** — *Founder & Team Leader*
* **Abdelrahman Anter**
* **Amira Hamada**
* **Maiar Emam**
* **Sarah Abdelsamie**

### Supervision & Host Institutions

* **Supervised by:** Dr. Reham Abobeah
* **Affiliation:** National Telecommunication Institute (**NTI**) - DiGilians Program | Ministry of Communications and Information Technology (**MCIT**) | Egyptian Military Academy

---

<sub>Built with ❤️ by the Addadak Team. Distributed under the MIT License.</sub>

```eof

تم تحديث الرسم التوضيحي للـ Architecture وشرح الـ Data Collector وقاعدة البيانات الموحدة بالشكل المظبوط تماماً! أبلغني لو تحب تعدل أي نقطة إضافية.

```
