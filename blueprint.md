# Cash Flow Application Blueprint

## 1. Overview

This document outlines the architecture, features, and development plans for the Cash Flow web application. The application is built with Vue.js, uses Vite for the development environment, and connects to a custom backend API to manage financial transactions.

## 2. Core Features

*   **Backend Integration:** Connects to `https://cash-flow-rouge.vercel.app/cashflows` for all CRUD operations.
*   **Dashboard View:** Visualizes monthly cash flow summaries with a bar chart, filterable by year.
*   **Report View:** Displays paginated transaction lists with filtering capabilities.
*   **Data Input View:** Provides a form for adding new transactions.
*   **Currency Formatting:** All monetary values are in Indonesian Rupiah (IDR).
*   **Dynamic Year Filters:** The year-based filters in both the Dashboard and Report views now dynamically populate a continuous range of years, from the earliest transaction year up to the current year. This ensures that the filter options are always relevant to the available data.


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

## 5. Current Task: Unify Year Filters

*   **Status:** **COMPLETED**
*   **Goal:** Ensure the year filter in the Report view functions identically to the one in the Dashboard view, displaying a dynamic range of years from the first transaction to the current year.

### 5.1. Plan

1.  **Modify `DashboardView.vue`:**
    *   **Action:** Updated the `availableYears` computed property.
    *   **Logic:** Instead of just listing unique years from transactions, it now finds the earliest transaction year and generates a continuous sequence of years from that point up to the present. The current year is set as the default selection.
2.  **Refactor `FilterControls.vue`:**
    *   **Action:** Abstracted the year filter logic into this reusable component.
    *   **Props:** Added a new `transactions` prop to receive the complete list of transactions.
    *   **Logic:** Implemented the same dynamic year generation logic as in the Dashboard, making the component data-driven and reusable.
3.  **Update `ReportView.vue`:**
    *   **Action:** Passed the full `transactions` array to the `FilterControls` component.
    *   **Result:** This allows `FilterControls` to access the necessary data to build the dynamic year filter, aligning its functionality with the Dashboard's filter.

