
    document.addEventListener('DOMContentLoaded', function() {
        const folders = document.querySelectorAll('.folder');
        const gallery = document.querySelector('.gallery');
        const folderOverlays = document.querySelectorAll('.folder-overlay');

        folders.forEach((folder, index) => {
            const coverPhoto = folder.querySelector('.cover-photo');
            const folderOverlay = folderOverlays[index];
            const folderContent = folderOverlay.querySelector('.folder-content');
            const images = folderContent.querySelectorAll('img');
            let currentImageIndex = 0;

            coverPhoto.addEventListener('click', () => {
                // Hide all other folder overlays
                folderOverlays.forEach(overlay => overlay.style.display = 'none');
                // Show the current folder overlay
                folderOverlay.style.display = 'block';
                gallery.classList.add('blur'); // Blur the gallery background
                showImage(currentImageIndex);
            });

            // Handle navigation and closing
            folderContent.addEventListener('click', (e) => {
                if (e.target.classList.contains('prev')) {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    showImage(currentImageIndex);
                } else if (e.target.classList.contains('next')) {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    showImage(currentImageIndex);
                } else if (e.target.classList.contains('back-button')) {
                    folderOverlay.style.display = 'none'; // Hide the overlay
                    gallery.classList.remove('blur'); // Remove the blur effect
                }
            });

            function showImage(index) {
                images.forEach((img, i) => {
                    img.style.display = i === index ? 'block' : 'none';
                });
            }
        });
    });
