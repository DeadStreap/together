import { useState, useEffect } from 'react';

function TasksPage() {
  const [contentItems, setContentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = 'localhost:3001'
  const API_URL = `http://${URL}/api/content_items`;

  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.statusText} (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setContentItems(data);
        } else {
          throw new Error('Некорректный формат данных от API');
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="loading">Загрузка контента...</div>;
  }

  if (error) {
    return (
      <div className="error">
        Ошибка: {error.message || 'Неизвестная ошибка'}
      </div>
    );
  }
  console.log(contentItems)
  return (
    <div className="tasks-container">
      <h1>Доступный контент ({contentItems.length})</h1>
      
      {contentItems.length > 0 ? (
        <ul className="content-list">
          {contentItems.map(item => (
            <li key={item.id} className="content-item">
              <div className="item-title">
                <strong>{item.title || 'Без названия'}</strong>
              </div>
              <div className="item-details">
                Категория: <em>{item.category || 'N/A'}</em>
              </div>
              <div className="item-dates">
                <span>
                  Начало: {item.start_date
                    ? new Date(item.start_date).toLocaleDateString()
                    : 'не указанно'}
                </span>
                <span>
                  Конец: {item.end_date
                    ? new Date(item.end_date).toLocaleDateString()
                    : 'не указанно'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>На данный момент контент отсутствует.</p>
      )}
    </div>
  );
}

export default TasksPage;
