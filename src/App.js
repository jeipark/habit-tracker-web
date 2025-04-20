import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import confetti from 'canvas-confetti';
import './App.css';

const App = () => {
  // State to hold the list of habits
  // The initial state is loaded from local storage if available
  // Otherwise, it starts with an empty array
  const [habits, setHabits] = useState( () => {
    const stored = localStorage.getItem('habits');
    return stored ? JSON.parse(stored) : [];
  });

  const [editingId, setEditingId] = useState(null); // Track the habit being edited
  const [tempTitle, setTempTitle] = useState(''); // Temporary title for editing

  // Load habits from local storage on initial render
  // and save habits to local storage whenever they change
  // This allows the app to persist habits even after a page refresh
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];
  const isHabitComplete = (habit) => habit.weekProgress.every((done) => done);

  // Function to toggle the completion of a habit for a specific day
  // and check if the habit is fully completed
  // If it is, trigger confetti
  // and mark the habit as completed
  // If it is not, mark the habit as not completed
  const toggleDay = (index, dayIndex) => {
    const updatedHabits = habits.map((habit, i) => {
      if (i === index) {
        const updatedWeek = [...habit.weekProgress];
        updatedWeek[dayIndex] = !updatedWeek[dayIndex];
        return { ...habit, weekProgress: updatedWeek };
      }
      return habit;
    });

    // Check if the habit is fully completed
    const justCompleted = updatedHabits[index];
    const wasComplete = habits[index].weekProgress.every((done) => done);
    const nowComplete = justCompleted.weekProgress.every((done) => done);
  
    // Trigger confetti if the habit just became fully completed
    if (!wasComplete && nowComplete) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }    

    setHabits(updatedHabits);
  };

  const toggleComplete = (id) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    // Sort so that completed items go to the bottom
    updatedHabits.sort((a, b) => a.completed - b.completed);
    setHabits(updatedHabits);
  };

  const deleteCompleted = () => {
    setHabits(habits.filter(habit => !habit.completed));
  };

  const addHabit = (name) => {
    if (!name.trim()) return;
    setHabits([
      ...habits,
      {
        id: Date.now().toString(),
        name,
        completed: false,
        weekProgress: [false, false, false, false, false, false, false],
      },
    ]);
  };

  const startEditing = (id, currentTitle) => {
    setEditingId(id); // Set the habit ID being edited
    setTempTitle(currentTitle); // Set the current title in the temporary state
  };

  const saveTitle = (id) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, name: tempTitle } : habit
    );
    setHabits(updatedHabits); // Update the habits state
    setEditingId(null); // Exit editing mode
  };

  const cancelEditing = () => {
    setEditingId(null); // Exit editing mode without saving
    setTempTitle(''); // Clear the temporary title
  };

  // Function to handle the drag and drop functionality
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reordered = Array.from(habits);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    setHabits(reordered);
  };

  // Filter out completed habits for the active list
  // and keep completed habits for the deleted list
  // and allow users to delete them
  const activeHabits = habits.filter(habit => !habit.completed);
  const completedHabits = habits.filter(habit => habit.completed);
  const toggleCompleted = (id) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
  };

  return (
    <div className="app">
      <h1 className="title">Habit Tracker</h1>
      <div className="add-habit">
        <input
          className="input"
          type="text"
          placeholder="Do something..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addHabit(e.target.value);
              e.target.value = '';
         }
          }}
        />
        <button
          className="add-button"
          onClick={() => {
            const input = document.querySelector('.input');
            addHabit(input.value);
            input.value = '';
          }}>
            <ion-icon name="add-circle" className="add-icon" />
          </button>
       
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="habits">
          {(provided) => (
            <div
              className="habit-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* Active Habits */}
              {activeHabits.map((habit, index) => (
                <Draggable key={habit.id} draggableId={habit.id} index={index}>
                  {(provided) => (
                    <div
                      className={`habit-item ${habit.completed ? 'habit-item--completed' : ''} ${
                        habit.weekProgress.every((day) => day) ? 'habit-item--finished' : ''
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="habit-header">
                        <div className="habit-title">
                          {editingId === habit.id ? (
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)} // Update tempTitle as the user types
                              onBlur={() => saveTitle(habit.id)} // Save the title when the input loses focus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveTitle(habit.id); // Save on Enter key
                                if (e.key === 'Escape') cancelEditing(); // Cancel on Escape key
                              }}
                              autoFocus
                            />
                          ) : (
                            <span onClick={() => startEditing(habit.id, habit.name)}>{habit.name}</span> // Start editing on click
                          )}
                        </div>
                        <button
                          className={`checkmark ${habit.completed ? 'active' : 'inactive'}`}
                          onClick={() => toggleComplete(habit.id)}
                          title={habit.completed ? "Mark as Active" : "Mark as Complete"}
                        >
                          <ion-icon name={habit.completed ? "checkmark" : "checkmark-circle-outline"}></ion-icon>
                        </button>
                      </div>
                      <div className="week-row">
                        {days.map((day, dayIndex) => (
                          <button
                            key={dayIndex}
                            onClick={() => toggleDay(index, dayIndex)}
                            className={`day ${
                              habit.weekProgress[dayIndex] ? 'day--completed' : ''
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Deleted Habits */}
              {completedHabits.length > 0 && (
                <div className="deleted-list">
                  <h3 className="deleted-title">Completed</h3>
                  {completedHabits.map((habit) => (
                    <div key={habit.id} className="habit-item habit-item--deleted">
                      <div className="habit-header">
                        <p className="habit-title completed">{habit.name}</p>
                        <button onClick={() => toggleCompleted(habit.id)} className="checkmark completed">
                          <ion-icon
                            name="checkmark-circle"
                            className={`check-icon completed`}
                          ></ion-icon>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {habits.some(h => h.completed) && (
        <button className="delete-completed" onClick={deleteCompleted}>
          <ion-icon name="trash-bin" className="delete-icon"></ion-icon> 
          Delete All Completed
        </button>
      )}
    </div>
  );
};

export default App;
