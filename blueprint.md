# Cash Flow Application Blueprint

## 1. Overview

This document outlines the architecture, features, and development plans for the Cash Flow web application. The application is built with Vue.js, uses Vite for the development environment, and connects to a custom backend API to manage financial transactions.

## 2. Core Features

*   **Backend Integration:** Connects to `https://cash-flow-rouge.vercel.app/cashflows` for all CRUD operations.
*   **Dashboard View:** Visualizes monthly cash flow summaries with a bar chart, filterable by year.
*   **Report View:** Displays paginated transaction lists with filtering capabilities.
*   **Data Input View:** Provides a form for adding new transactions.
*   **Currency Formatting:** All monetary values are in Indonesian Rupiah (IDR).

## 3. Design & Styling

*   **Theme:** Modern and professional with a clean layout.
*   **Color Palette:** Green for income, red for outcome, with neutral grays.
*   **Typography:** "Poppins" font.
*   **Interactivity:** Smooth transitions and clear user feedback.

## 4. Completed Tasks

### 4.1. Add Chart Dashboard
*   **Status:** **COMPLETED**
*   **Summary:** Created a new dashboard page that displays a bar chart of total monthly cash-in vs. cash-out, with a dropdown to filter the data by year.

### 4.2. Refactor `Dashboard` to `Report`
*   **Status:** **COMPLETED**
*   **Summary:** Renamed all relevant files and references.

### 4.3. Add Delete Functionality
*   **Status:** **COMPLETED**
*   **Summary:** Implemented transaction deletion.

### 4.4. Adjust Pagination Trigger
*   **Status:** **COMPLETED**
*   **Summary:** Set pagination to 5 items per page.
