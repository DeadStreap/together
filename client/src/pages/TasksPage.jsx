import { useState, useEffect} from 'react';

function TasksPage() {
  const [contentItems, setContentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = 'together-alpha-one.vercel.app/';

  useEffect(() => {
     const API_URL = `https://${API}/api/content_items`;  

    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setContentItems(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Ошибка при получении данных:", error);
        setError(error);
        setIsLoading(false);
      });
  }, []); 

  if (isLoading) {
    return <div className="loading">Загрузка контента...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error.message}</div>;
  }

  return (
    <div className="tasks-container">
      <h1>Доступный контент ({contentItems.length})</h1>
      {contentItems.length > 0 ? (
        <ul className="content-list">
          {contentItems.map(item => (
            <li key={item.id} className="content-item">
              <div className="item-title">**{item.title || 'Без названия'}**</div>
              <div className="item-details">Категория: *{item.category || 'N/A'}*</div>
              <div className="item-dates">
                <span>Начало: {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'N/A'}</span>
                <span>Конец: {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'N/A'}</span>
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
