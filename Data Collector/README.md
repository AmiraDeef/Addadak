Below is the complete, production-ready README.md file content based on your
project's code structure and requirements. You can copy and save this code block
directly into your project's root folder.

# Addadak - Data Collector Service

Addadak Data Collector is an automated background synchronization service designed to regularly fetch, validate, transform, and persist utility metrics from external providers. Currently configured for electricity meters, the service is built using a structured, modular design pattern to ensure scalability for other utility types (such as Water and Gas).

---

## Architecture & Pipeline Flow

The project adheres to Clean Architecture principles, decoupling external data source integration, validation rules, business transformation, and data persistence layers. This separation of concerns ensures that modifications to external APIs or database schemas do not break the core data collection logic.

### Data Pipeline Sequence

+----------------------------+ | ElectricityProvider (API) | <-- Fetches raw
utility payload (Axios + Axios-Retry) +--------------+-------------+ | v
+--------------+-------------+ | ElectricityValidator | <-- Verifies structural
integrity, fields, & types +--------------+-------------+ | v
+--------------+-------------+ | ElectricityTransformer | <-- Normalizes format
& calculates "billingMonth" +--------------+-------------+ | v
+--------------+-------------+ | Duplicate Check | <-- Prevents redundant writes
(ReadingRepository.exists) +--------------+-------------+ | v
+--------------+-------------+ | (Delta Calculation)* | <-- Ready for
consumption (ReadingRepository.findLatest) +--------------+-------------+ | v
+--------------+-------------+ | ReadingRepository | <-- Handles Database-level
abstract interface +--------------+-------------+ | v
+--------------+-------------+ | MongoDB (Metrics) | <-- Final persistent
storage +----------------------------+


1. **Provider**: Requests raw readings from the designated utility API.
2. **Validator**: Inspects the incoming payload structurally (e.g., types, formatting, and non-empty checks) without modifying the data.
3. **Transformer**: Normalizes the validated raw fields to match internal schema requirements, including parsing the billing month from the timestamp.
4. **Duplicate Check**: Consults the database to check if a record with the same meter number and reading date already exists.
5. **Delta Calculation / Storage Prep**: The `ReadingRepository` contains query methods (such as `findLatest`) that can be used to compare the current reading against previous ones to calculate usage difference (delta) when required.
6. **Repository & DB**: Saves the structured payload into MongoDB using the `Metrics` schema.

---

## Key Features

* **Automated Scheduling (`node-cron`)**: Executes sync tasks automatically based on configurable cron expressions.
* **Concurrency Protection (Locking)**: Uses a state flag (`isRunning`) to prevent overlapping execution cycles if a previous sync cycle is still in progress.
* **Resilient Network Connections**: Built with `axios-retry` featuring exponential backoff, automatically retrying requests on network glitches or transient 5xx server errors.
* **Data Sanitization & Validation**: Lightweight, dependency-free validation checks raw fields before database ingestion to maintain data quality.
* **Structured Logging (`winston`)**: Implements dual file-based transports (`error.log` and `combined.log`) along with a colorized console formatter for development environments.
* **Graceful Shutdown Handling**: Listens for termination signals (`SIGINT`, `SIGTERM`) to cleanly disconnect from MongoDB and stop active cron tasks.

---

## Project Folder Structure

```text
data-collector/
├── config/
│   ├── database.js               # Database connection logic
│   └── index.js                  # Centralized configuration and environment validation
├── models/
│   └── reading.model.js          # Mongoose schema definitions and validation patterns
├── providers/
│   └── electricityProvider.js    # Remote API communication wrapper with retry logic
├── repositories/
│   └── readingRepository.js      # Data access layer abstraction
├── scheduler/
│   └── electricityScheduler.js   # Automated task manager and execution lock
├── services/
│   └── electricityCollectorService.js # Core business logic coordinating the sync pipeline
├── transformers/
│   └── electricityTransformer.js # Structural mapper converting external data to system format
├── utils/
│   └── logger.js                 # Winston-configured application logger
├── validators/
│   └── electricityValidator.js   # Validation rules for incoming utility data
├── .gitignore                    # Local version control exclusions
├── app.js                        # System entrypoint (Express setup & startup orchestrator)
├── package.json                  # Dependencies and engine definitions
├── testSync.js                   # Utility script to manually trigger a sync cycle
└── notes.text                    # Development scratchpad notes

Environment Variables

The application requires an environment file (.env) in the root directory to
define key configurations. The system validates the presence of these
environment variables upon startup to prevent misconfigurations.

| Variable Name          | Description                                           | Example Value                       |
| :--------------------- | :---------------------------------------------------- | :---------------------------------- |
| `DB_URL`               | MongoDB connection string                             | `mongodb://localhost:27017/addadak` |
| `PORT`                 | Local port number to bind the Express application     | `3000`                              |
| `TIME_OUT`             | External API request timeout limit (in seconds)       | `5`                                 |
| `ELEC_API_URL`         | Base URL of the electricity utility provider API      | `https://api.example.com`           |
| `NODE_ENV`             | Application environment state (`dev` or `production`) | `dev`                               |
| `SYNC_CRON_EXPRESSION` | Cron expression scheduling the sync interval          | `0 */1 * * *` *(Hourly)*            |

Installation & Running Guide

Prerequisites

  - Node.js (v16+ recommended)
  - MongoDB (running instance)

1. Install Dependencies

Clone the repository, navigate to the project directory, and install the
required modules:

npm install

2. Configure Environment Variables

Create a .env file in the root directory of the project:

DB_URL=mongodb://localhost:27017/addadak
PORT=3000
TIME_OUT=5
ELEC_API_URL=https://dummyjson.com
NODE_ENV=dev
SYNC_CRON_EXPRESSION=0 */1 * * *

3. Run Manual Sync Test

To verify database connectivity, network configuration, and raw data integration
immediately without waiting for the scheduler, run the manual test script:

node testSync.js

4. Start the Application

To run the service continuously with the automated cron scheduler enabled:

node app.js

Data Schema Reference

Collected records are processed and saved using the Metrics model. The database
structure ensures strict format verification and query performance optimization.

Collection: metrics

| Schema Field   | Type     | Validation / Constraints                                                                    | Description                                             |
| :------------- | :------- | :------------------------------------------------------------------------------------------ | :------------------------------------------------------ |
| `nationalID`   | `String` | Required. Must match a valid 14-digit Egyptian National ID pattern.                         | Identifies the owner associated with the utility.       |
| `utility`      | `String` | Required. Allowed values: `["Electricity", "Water", "Gas"]`.                                | Indicates the type of utility resource.                 |
| `meterNumber`  | `String` | Required. Must be exactly 10 digits.                                                        | Unique identifier of the physical utility meter.        |
| `meterType`    | `String` | Required. Default: `"Smart Card"`. Allowed values: `["Smart Meter", "Smart Card", "Bill"]`. | The delivery type of the utility meter.                 |
| `address`      | `String` | Required.                                                                                   | Location information associated with the meter.         |
| `billingMonth` | `String` | Required. Formatted as `YYYY-MM`.                                                           | Chronological key used for grouping utility usage logs. |
| `reading`      | `Number` | Required. Must be a non-negative number ($\ge 0$).                                          | The recorded utility usage index.                       |
| `readingDate`  | `Date`   | Default: `Date.now`.                                                                        | Timestamp of the specific meter collection record.      |

Indexes

  - Single Field Index: billingMonth (1) - Speeds up grouping and reporting
    queries based on monthly billing intervals.
  - Compound Index: { meterNumber: 1, readingDate: -1 } - Facilitates quick
    retrievals of the latest record for a specific meter to compare readings and
    detect potential duplicate occurrences.

