function AboutPage() {
  return (
    <div className="about-page">
      <h2>О проекте</h2>
      <p>Это демо-приложение с маршрутизацией на React.</p>
      <ul>
        <li>Роутинг через <code>react-router-dom</code></li>
        <li>Состояние в <code>useState</code></li>
        <li>Прокси к бэкенду (см. <code>vite.config.js</code>)</li>
      </ul>
    </div>
  );
}

export default AboutPage;

