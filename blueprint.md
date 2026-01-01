# Cash Flow Application Blueprint

## 1. Overview

This document outlines the architecture, features, and development plans for the Cash Flow web application. The application is built with Vue.js, uses Vite for the development environment, and connects to a custom backend API to manage financial transactions.

## 2. Core Features

*   **User Authentication:** A secure login page requires users to authenticate with a username and password (`cafein`/`pass1234`) before accessing the application.
*   **Backend Integration:** Connects to `https://cash-flow-rouge.vercel.app/cashflows` for all CRUD operations.
*   **Dashboard View:** Visualizes monthly cash flow summaries with a bar chart, filterable by year.
*   **Report View:** Displays paginated transaction lists with filtering capabilities.
*   **Data Input View:** Provides a form for adding new transactions.
*   **Currency Formatting:** All monetary values are in Indonesian Rupiah (IDR).
*   **Dynamic Year Filters:** The year-based filters in both the Dashboard and Report views now dynamically populate a continuous range of years, from the earliest transaction year up to the current year.


## 3. Design & Styling

*   **Theme:** Modern and professional with a clean layout.
*   **Color Palette:** Green for income, red for outcome, with neutral grays.
*   **Typography:** "Poppins" font.
*   **Interactivity:** Smooth transitions and clear user feedback.

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

## 5. Current Task: Implement Login Page

*   **Status:** **IN PROGRESS**
*   **Goal:** Create a secure, professional-looking login page to gate access to the application.

### 5.1. Plan

1.  **Create `LoginView.vue`:**
    *   Design a visually appealing and user-friendly login form.
    *   Implement logic to handle user input for username and password.
    *   Validate credentials against the specified username (`cafein`) and password (`pass1234`).
    *   Provide clear visual feedback for successful or failed login attempts.
2.  **Create `useAuth.js` Composable:**
    *   Develop a state management solution to track the user's authentication status (logged in or out).
    *   Expose functions like `login()` and `logout()` to be used across the application.
3.  **Update `router/index.js`:**
    *   Add a new route for the `/login` path.
    *   Implement a navigation guard (`beforeEach`) to check for authentication on protected routes.
    *   Redirect unauthenticated users to the `/login` page.
4.  **Modify `App.vue`:**
    *   Conditionally render the `NavBar` component only when the user is authenticated.
