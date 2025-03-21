export const FrequentUsageReportTemplate = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт о переиспользуемых паролях</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      text-align: center; 
      padding: 20px; 
      background-color: #f5f5f5; 
      color: #333; 
    }
    h1 { 
      color: #ff9800; 
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
    .password-group { 
      margin-bottom: 40px; 
      padding: 15px; 
      border: 1px solid #ddd; 
      border-radius: 5px; 
      text-align: left; 
      background: #fff8e1; 
    }
    .password-group h2 { 
      font-size: 20px; 
      margin: 0 0 15px; 
      color: #ff9800; 
    }
    .entry-card { 
      padding: 10px; 
      margin: 10px 0; 
      border: 1px solid #eee; 
      border-radius: 4px; 
      background: white; 
    }
    .entry-card p { 
      margin: 5px 0; 
    }
    .entry-card strong { 
      color: #555; 
    }
    .recommendations { 
      background: #e8f5e9; 
      padding: 10px; 
      border-left: 4px solid #4CAF50; 
      margin-top: 15px; 
    }
  </style>
</head>
<body>
  <h1>Отчёт о переиспользуемых паролях</h1>
  <div class="report-container">
    {{REUSED_PASSWORD_GROUPS}}
  </div>
</body>
</html>
`;