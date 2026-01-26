import { useState } from 'react';

function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Купить молоко' },
    { id: 2, text: 'Сделать домашнее задание' },
  ]);

  const addTask = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setTasks([...tasks, { id: Date.now(), text: e.target.value }]);
      e.target.value = '';
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="tasks-page">
      <h2>Список задач</h2>
      <input
        type="text"
        className="task-input"
        placeholder="Новая задача (нажмите Enter)"
        onKeyDown={addTask}
      />
      <button className="add-btn" onClick={() => {
        const input = document.querySelector('.task-input');
        if (input.value) addTask({ key: 'Enter', target: input });
      }}>
        Добавить
      </button>

      <ul className="tasks-list">
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            <span className="task-text">{task.text}</span>
            <button
              onClick={() => deleteTask(task.id)}
              className="delete-btn"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksPage;

