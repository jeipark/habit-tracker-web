import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import confetti from 'canvas-confetti';
import './App.css';

const App = () => {
  const [habits, setHabits] = useState( () => {
    const stored = localStorage.getItem('habits');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];
  const isHabitComplete = (habit) => habit.weekProgress.every((done) => done);

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

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reordered = Array.from(habits);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    setHabits(reordered);
  };

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
                      className={`habit-item ${habit.completed ? 'completed' : 'not-completed'}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="habit-header">
                        <p className="habit-title">
                          {habit.name}
                        </p>
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
                            className={`day-box ${
                              habit.weekProgress[dayIndex] ? 'day-box-completed' : ''
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
              {/* Completed Habits */}
              {completedHabits.length > 0 && (
                <div className="completed-list">
                  <h3 className="completed-title">Completed Habits</h3>
                  {completedHabits.map((habit) => (
                    <div key={habit.id} className="habit-item completed">
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
