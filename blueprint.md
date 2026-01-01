# Cash Flow Application Blueprint

## 1. Overview

This document outlines the architecture, features, and development plans for the Cash Flow web application. The application is built with Vue.js, uses Vite for the development environment, and connects to a custom backend API to manage financial transactions.

## 2. Core Features

*   **User Authentication:** A secure login page requires users to authenticate with a username and password (`cafein`/`pass1234`) before accessing the application.
*   **Backend Integration:** Connects to `https://cash-flow-rouge.vercel.app/cashflows` for all CRUD operations.
*   **Dashboard View:** Visualizes monthly cash flow summaries with a bar chart, filterable by year.
*   **Report View:** Displays paginated transaction lists with filtering capabilities.
*   **Data Input View:** Provides a form for adding new transactions with automated logic.
*   **Currency Formatting:** All monetary values are in Indonesian Rupiah (IDR).
*   **Dynamic Year Filters:** The year-based filters in both the Dashboard and Report views now dynamically populate a continuous range of years, from the earliest transaction year up to the current year.

## 3. Design & Styling

*   **Theme:** A cohesive, modern, and professional dark theme is applied globally.
*   **Color Palette:** A sophisticated palette featuring a deep blue-purple gradient (`#1a1a2e` to `#2a2a4a`), bright cyan (`#00f2fe`) and pink (`#ff79c6`) accents, and light text (`#e0e0e0`).
*   **Typography:** "Poppins" font is used throughout the application.
*   **Interactivity:** Smooth transitions, glowing effects, and clear user feedback are implemented across interactive elements.
*   **Glassmorphism:** Key UI components utilize a semi-transparent, blurred-glass effect for a modern aesthetic.

## 4. Completed Tasks

### 4.1. Add Chart Dashboard
*   **Status:** **COMPLETED**

### 4.2. Refactor `Dashboard` to `Report`
*   **Status:** **COMPLETED**

### 4.3. Add Delete Functionality
*   **Status:** **COMPLETED**

### 4.4. Adjust Pagination Trigger
*   **Status:** **COMPLETED**

### 4.5. Unify Year Filters
*   **Status:** **COMPLETED**

### 4.6. Implement Login Page
*   **Status:** **COMPLETED**

### 4.7. Login Page Redesign
*   **Status:** **COMPLETED**

### 4.8. Dashboard Redesign
*   **Status:** **COMPLETED**

### 4.9. Fix Input Data Page Styling and Logic
*   **Status:** **COMPLETED**

### 4.10. Make All Pages Responsive
*   **Status:** **COMPLETED**

### 4.11. Improve Dropdown Readability
*   **Status:** **COMPLETED**
*   **Goal:** To improve the readability of dropdown options across the application.
*   **Changes:**
    *   **Consistent Styling:** Applied a consistent dark theme to dropdown options in `DashboardView.vue`, `FilterControls.vue`, and `CashFlowForm.vue`, ensuring the background and text colors are legible and align with the application's overall design.

## 5. Next Steps
*   Awaiting user feedback.
