// module.exports = function (config) {
//     config.set({
//         frameworks: ['jasmine', '@angular-devkit/build-angular'],
//         plugins: [
//             require('karma-jasmine'),
//             require('karma-chrome-launcher'),
//             require('karma-coverage'), // Убедитесь, что этот плагин добавлен
//             require('@angular-devkit/build-angular/plugins/karma')
//         ],
//         coverageReporter: {
//             dir: require('path').join(__dirname, './coverage'), // Папка для отчётов
//             subdir: '.',
//             reporters: [
//                 { type: 'html' }, // HTML-отчёт с графиками и таблицами
//                 { type: 'text-summary' } // Краткий текстовый отчёт в консоли
//             ]
//         },
//         reporters: ['progress', 'kjhtml', 'coverage'], // Добавьте 'coverage'
//         browsers: ['Chrome'],
//         restartOnFileChange: true
//     });
// };

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'), // Добавлен плагин kjhtml
            require('karma-coverage'), // Для покрытия кода
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage'),
            subdir: '.',
            reporters: [
                { type: 'html' }, // HTML-отчёт с графиками
                { type: 'text-summary' } // Текстовый отчёт в консоли
            ]
        },
        reporters: ['progress', 'kjhtml', 'coverage'], // Убедитесь, что kjhtml и coverage указаны
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        restartOnFileChange: true
    });
};