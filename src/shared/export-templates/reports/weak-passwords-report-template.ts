export const WeakPasswordsReportTemplate = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт о слабых паролях</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      text-align: center; 
      padding: 20px; 
      background-color: #f5f5f5; 
      color: #333; 
    }
    h1 { 
      color: #d32f2f; 
      margin-bottom: 30px; 
    }
    .report-container { 
      max-width: 900px; 
      margin: 0 auto; 
      background: white; 
      padding: 20px; 
      border-radius: 8px; 
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
    }
    .password-entry { 
      margin-bottom: 30px; 
      padding: 15px; 
      border: 1px solid #ddd; 
      border-radius: 5px; 
      text-align: left; 
    }
    .password-entry h2 { 
      font-size: 18px; 
      margin: 0 0 10px; 
      color: #1976d2; 
    }
    .password-details { 
      margin: 10px 0; 
    }
    .password-details strong { 
      color: #555; 
    }
    .feedback { 
      background: #fff3f3; 
      padding: 10px; 
      border-left: 4px solid #d32f2f; 
      margin-top: 10px; 
    }
    .recommendations { 
      background: #e8f5e9; 
      padding: 10px; 
      border-left: 4px solid #4CAF50; 
      margin-top: 10px; 
    }
  </style>
</head>
<body>
  <h1>Отчёт о слабых паролях</h1>
  <div class="report-container">
    {{WEAK_PASSWORD_ENTRIES}}
  </div>
</body>
</html>
`;