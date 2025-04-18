# Habit Tracker Web App

A simple and interactive habit tracker web application that allows users to manage their daily habits, track progress for each day of the week, and reorder habits using drag-and-drop functionality. Completed habits are displayed separately for better organization.

---

## Features

  * Add Habits: Create new habits to track.
  * Track Weekly Progress: Toggle the completion status for each day of the week.
  * Drag-and-Drop: Reorder habits using drag-and-drop functionality.
  * Mark as Completed: Mark habits as completed and move them to a separate "Completed Habits" section.
  * *Delete Habits: Remove habits from the list.
  * Confetti Celebration: Celebrate when a habit is fully completed for the week.

---

## Technologies Used

  * React: Frontend framework for building the user interface.
  * react-beautiful-dnd: Library for drag-and-drop functionality.
  * CSS: Styling for the app.
  * Ionicons: Icons for buttons and visual elements.

---

## Installation

   1. Clone the repository:
      bash
      git clone https://github.com/your-username/habit-tracker-web.git
      cd habit-tracker-web

   2. Install dependencies:
      npm install

   3. Start the development server:
      npm start

   4. Open the app in your browser:
      http://localhost:3000

## Usage

   Adding a Habit
      1. Enter the name of the habit in the input field.
      2. Press Enter to add the habit to the list.

   Tracking Weekly Progress
      1. Click on the day boxes (e.g., M, T, W) to toggle the completion status for that day.
      2. A green background indicates the day is completed.

   Reordering Habits
      1. Drag a habit by its header to reorder it in the list.

   Marking Habits as Completed
      1. Click the checkmark icon next to a habit to mark it as completed.
      2. Completed habits will move to the "Completed Habits" section.

   Deleting Habits
      1. Click the "Delete" button to remove a habit from the list.

## Folder Structure

habit-tracker-web/
├── public/                 # Public assets
├── src/
│   ├── App.js              # Main React component
│   ├── App.css             # Styling for the app
│   ├── index.js            # Entry point for the app
│   └── components/         # (Optional) Additional components
├── package.json            # Project dependencies and scripts
└── README.md               # Documentation

## Customization

   Styling
      * Modify the App.css file to customize the appearance of the app.

   Confetti Celebration
      * The confetti effect is triggered when a habit is fully completed for the week. You can adjust the particle count, spread, and origin in the toggleDay function.

## Dependencies

  * react: ^18.0.0
  * react-beautiful-dnd: ^13.1.0
  * ionicons: ^5.5.2

## Future Enhancements

  * Add a calendar view for tracking habits over time.
  * Add user authentication to save habits for individual users.
  * Add notifications or reminders for incomplete habits.
  * Implement dark mode for better accessibility.

