// // Функция копирования текста в буфер обмена
// export function copyToClipboard(text: string, clearBuffer: boolean, clearBufferTimeout:number): void {
//     if (!navigator.clipboard) {
//         const textArea = document.createElement('textarea');
//         textArea.value = text;
//         document.body.appendChild(textArea);
//         textArea.select();
//         try {
//             if(clearBuffer){
//                 setTimeout(clearClipboard, clearBufferTimeout);
//             }
//         } catch (err) {
//         }
//         document.body.removeChild(textArea);
//         return;
//     }
//
//     navigator.clipboard.writeText(text)
//         .then(() => {
//             if(clearBuffer){
//             setTimeout(clearClipboard, clearBufferTimeout);
//             }
//         })
//         .catch(err => {
//         });
// }
//
// // Функция очистки буфера обмена
// export function clearClipboard(): void {
//     if (navigator.clipboard) {
//         navigator.clipboard.writeText('\x00')
//             .then(() => {
//             })
//             .catch(err => {
//             });
//     } else {
//         const textArea = document.createElement('textarea');
//         textArea.value = '\x00';
//         document.body.appendChild(textArea);
//         textArea.select();
//         try {
//             document.execCommand('copy');
//         } catch (err) {
//         }
//         document.body.removeChild(textArea);
//     }
// }

// Функция копирования текста в буфер обмена
export function copyToClipboard(text: string, clearBuffer: boolean = true, clearBufferTimeout:number = 20000): void {
    if (!navigator.clipboard) {

        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            // if(clearBuffer){
                setTimeout(clearClipboard, 20000);
            // }
        } catch (err) {

        }
        document.body.removeChild(textArea);
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => {
            if(clearBuffer){
                setTimeout(clearClipboard, clearBufferTimeout);
            }
        })
        .catch(err => {
        });
}

// Функция очистки буфера обмена
export function clearClipboard(): void {
    if (navigator.clipboard) {
        navigator.clipboard.writeText('')
            .then(() => {
            })
            .catch(err => {
            });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = '';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
        }
        document.body.removeChild(textArea);
    }
}