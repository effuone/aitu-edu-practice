# AITU Education Practice

This project imports annotation data from a JSON file into a PostgreSQL database using Prisma. It also includes the conversion of rectangle coordinates to YOLO format.

## Prerequisites

- Node.js
- Yarn
- Docker
- Docker Compose

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Configure Environment Variables

Rename the `.env.example` file to `.env` and update the environment variables as needed.

```bash
mv .env.example .env
```

### 3. Run PostgreSQL with Docker Compose

Ensure Docker and Docker Compose are installed on your system. Then, run the following command to start PostgreSQL:

```bash
docker-compose up -d
```

### 4. Install Dependencies

Install the required dependencies using Yarn:

```bash
yarn install
```

### 5. Run the Import Script

Run the import script to populate the database with annotation data from the JSON file:

```bash
yarn start:dev
```

### 6. Open Prisma Studio

To view and manage the database, open Prisma Studio:

```bash
yarn prisma studio
```

## YOLO Format Conversion

The import script includes a function to convert rectangle coordinates to YOLO format. The conversion function takes `x`, `y`, `width`, `height`, `imageWidth`, and `imageHeight` as inputs and returns the YOLO formatted coordinates.

## Project Structure

- **.env**: Environment variables
- **docker-compose.yml**: Docker Compose configuration for PostgreSQL
- **prisma/schema.prisma**: Prisma schema definition
- **src/main.ts**: Main script to import data and convert coordinates to YOLO format
- **src/utils/convertToYolo.ts**: Utility function for YOLO format conversion