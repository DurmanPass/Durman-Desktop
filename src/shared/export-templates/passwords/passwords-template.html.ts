// export const ExportPasswordsHtmlTemplate = `
// <!DOCTYPE html>
// <html lang="ru">
// <head>
//   <meta charset="UTF-8">
//   <title>Passwords</title>
//   <style>
//     body { text-align: center; }
//     table { border-collapse: collapse; width: 100%; max-width: 800px; margin: 20px auto; }
//     th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//     th { background-color: #f2f2f2; }
//     tr:nth-child(even) { background-color: #f9f9f9; }
//     .search-container { margin: 20px auto; max-width: 800px; }
//     .chip-container { margin: 10px auto; max-width: 800px; }
//     .chip { display: inline-block; padding: 5px 10px; margin: 5px; background-color: #e0e0e0; border-radius: 12px; cursor: pointer; }
//     .chip.active { background-color: #4CAF50; color: white; }
//     .hidden { display: none; }
//   </style>
// </head>
// <body>
//   <h1>Ваши пароли</h1>
//   <div class="search-container">
//     <input type="text" id="searchInput" placeholder="Поиск по таблице..." style="width: 100%; padding: 8px;">
//   </div>
//   <div class="chip-container" id="categoryChips">
//     <!-- Чип "Все" добавлен статически, остальные категории через JS -->
//     <span class="chip active" id="allChip">Все</span>
//   </div>
//   <table id="passwordTable">
//     <thead>
//       <tr>
//         <th>Название</th>
//         <th>URL</th>
//         <th>Имя пользователя</th>
//         <th>Электронная почта</th>
//         <th>Номер телефона</th>
//         <th>Пин-код</th>
//         <th>Сила пароля(от 0 до 4)</th>
//         <th>Пароль</th>
//         <th>Категория</th>
//         <th>Создан</th>
//         <th>Обновлен</th>
//         <th>Описание</th>
//       </tr>
//     </thead>
//     <tbody>
//       {{TABLE_ROWS}}
//     </tbody>
//   </table>
//
//   <script>
//     document.addEventListener('DOMContentLoaded', () => {
//       const searchInput = document.getElementById('searchInput');
//       const table = document.getElementById('passwordTable');
//       const rows = table.getElementsByTagName('tr');
//       const chipsContainer = document.getElementById('categoryChips');
//       const allChip = document.getElementById('allChip');
//       let activeCategory = null; // null означает "Все"
//
//       // Собираем уникальные категории
//       const categories = new Set();
//       for (let i = 1; i < rows.length; i++) {
//         const category = rows[i].cells[8].textContent.trim();
//         if (category) categories.add(category);
//       }
//
//       // Добавляем чипы для категорий
//       categories.forEach(category => {
//           if(category !== 'Все'){
//                       const chip = document.createElement('span');
//         chip.className = 'chip';
//         chip.textContent = category;
//         chip.onclick = () => {
//           activeCategory = category;
//           document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
//           chip.classList.add('active');
//           filterTable();
//         };
//         chipsContainer.appendChild(chip);
//           }
//       });
//
//       // Обработчик для чипа "Все"
//       allChip.onclick = () => {
//         activeCategory = null; // Сбрасываем фильтр по категории
//         document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
//         allChip.classList.add('active');
//         filterTable();
//       };
//
//       // Функция фильтрации
//       function filterTable() {
//         const searchText = searchInput.value.toLowerCase();
//         for (let i = 1; i < rows.length; i++) {
//           const row = rows[i];
//           const text = row.textContent.toLowerCase();
//           const category = row.cells[8].textContent.trim();
//           const matchesSearch = text.includes(searchText);
//           const matchesCategory = !activeCategory || category === activeCategory;
//           row.classList.toggle('hidden', !(matchesSearch && matchesCategory));
//         }
//       }
//
//       searchInput.addEventListener('input', filterTable);
//     });
//   </script>
// </body>
// </html>
// `;

export const ExportPasswordsHtmlTemplate = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Passwords</title>
  <style>
    body { text-align: center; }
    table { border-collapse: collapse; width: 100%; max-width: 800px; margin: 20px auto; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .search-container { margin: 20px auto; max-width: 800px; }
    .chip-container { margin: 10px auto; max-width: 800px; }
    .chip { display: inline-block; padding: 5px 10px; margin: 5px; background-color: #e0e0e0; border-radius: 12px; cursor: pointer; }
    .chip.active { background-color: #4CAF50; color: white; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <h1>Ваши пароли</h1>
  <div class="search-container">
    <input type="text" id="searchInput" placeholder="Поиск по таблице..." style="width: 100%; padding: 8px;">
  </div>
  <div class="chip-container" id="categoryChips">
    <!-- Чип "Все" добавлен статически, остальные категории через JS -->
    <span class="chip active" id="allChip">Все</span>
  </div>
  <table id="passwordTable">
    <thead>
      <tr>
        <th>Название</th>
        <th>URL</th>
        <th>Имя пользователя</th>
        <th>Электронная почта</th>
        <th>Номер телефона</th>
        <th>Пин-код</th>
        <th>Сила пароля(от 0 до 4)</th>
        <th>Пароль</th>
        <th>Категория</th>
        <th>Создан</th>
        <th>Обновлен</th>
        <th>Описание</th>
      </tr>
    </thead>
    <tbody>
      {{TABLE_ROWS}}
    </tbody>
  </table>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.getElementById('searchInput');
      const table = document.getElementById('passwordTable');
      const rows = table.getElementsByTagName('tr');
      const chipsContainer = document.getElementById('categoryChips');
      const allChip = document.getElementById('allChip');
      let activeCategory = null; // null означает "Все"

      // Собираем уникальные категории
      const categories = new Set();
      for (let i = 1; i < rows.length; i++) {
        const category = rows[i].cells[8].textContent.trim();
        if (category && category !== '-') categories.add(category);
      }

      // Добавляем чипы для категорий
      categories.forEach(category => {
          if(category !== 'Все'){
                      const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = category;
        chip.onclick = () => {
          activeCategory = category;
          document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          filterTable();
        };
        chipsContainer.appendChild(chip);
          }
      });

      // Обработчик для чипа "Все"
      allChip.onclick = () => {
        activeCategory = null; // Сбрасываем фильтр по категории
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        allChip.classList.add('active');
        filterTable();
      };

      // Функция фильтрации
      function filterTable() {
        const searchText = searchInput.value.toLowerCase();
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const text = row.textContent.toLowerCase();
          const category = row.cells[8].textContent.trim();
          const matchesSearch = text.includes(searchText);
          // Показываем все записи, если activeCategory === null (чип "Все")
          const matchesCategory = activeCategory === null || category === activeCategory;
          row.classList.toggle('hidden', !(matchesSearch && matchesCategory));
        }
      }

      searchInput.addEventListener('input', filterTable);
    });
  </script>
</body>
</html>
`;