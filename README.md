# Tuning Shop

A full-stack web application for buying car modifications and the system managment. Built with React (TypeScript) frontend, ASP.NET backend, and Azure MySQL database.

## Features

- **Parts Catalog:** Browse and search for available car modifications.
- **Admin Panel:** Admins can add, update, or remove car modifications.
- **Cloud Hosted:** Website hosted on Azure.

## Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** ASP.NET Core Web API
- **Database:** Azure MySQL
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js & npm
- .NET 8 SDK or later
- MySQL (Azure or local)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/CloSpex52/tuning_shop.git
   ```

2. **Frontend:**

   ```bash
   cd tuning_shop/frontend
   npm install
   npm start
   ```

3. **Backend:**

   ```bash
   cd tuning_shop/backend
   dotnet restore
   dotnet run
   ```

4. **Configure Database:**
   - Update connection strings in `appsettings.json` or in `.env` or add to .NET secrets for Azure MySQL.
