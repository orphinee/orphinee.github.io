
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js') 
            .then(registration => {
                console.log('Service Worker berhasil didaftarkan dengan scope:', registration.scope);
            })
            .catch(error => {
                console.error('Pendaftaran Service Worker gagal:', error);
            });
    });
} else {
    console.warn('Browser ini tidak mendukung Service Workers.');
}