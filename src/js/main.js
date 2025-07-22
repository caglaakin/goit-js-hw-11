import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const searchInput = document.querySelector('.searchInput');
const searchButton = document.querySelector('.searchButton');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

const API_KEY = "51442110-4fde2839a6cf4cc45b6823f02";

let lightbox = new SimpleLightbox('.gallery a.gallery-link', {
  navText: ['❮', '❯'],
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
  close: true,
  closeText: '×',
  animationSlide: true,
  animationSpeed: 250,
  enableKeyboard: true,
  overlay: true,
  overlayOpacity: 0.8,
  sourceAttr: 'href',
  zoom: false,
});

function hideLoader() {
    loader.classList.add('is-hidden');
}

function showLoader() { 
    loader.classList.remove('is-hidden');
}

function createGalleryMarkup(images) {
    return images.map((image) => { 
        return `
        <li class="gallery-item">
            <a class="gallery-link" href="${image.largeImageURL}">
                <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}" />
            </a>
            <div class="image-info">
                <p class="info"><b>Likes</b>${image.likes}</p>
                <p class="info"><b>Views</b>${image.views}</p>
                <p class="info"><b>Comments</b>${image.comments}</p>
                <p class="info"><b>Downloads</b>${image.downloads}</p>
            </div>
        </li>`;
    }).join('');
}

form.addEventListener("submit", (event) => { 
    event.preventDefault();

    const query = searchInput.value.trim();

    if (query ==="") {
        iziToast.error({
          title: 'Error',
          message: 'Please enter a search term.',
          position: 'topRight',
          backgroundColor: '#EF4040',
          messageColor: 'white',
          progressBarColor: '#B51B1B',
          closeOnClick: true,
          closeOnEscape: true,
          close: true,
          timeout: 3000,
          maxWidth: '450px',
        });
        return;
    }

    gallery.innerHTML = '';
    showLoader();

    const searchParams = new URLSearchParams({
        key: API_KEY,
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
    });

    fetch(`https://pixabay.com/api/?${searchParams}`)
        .then((response) => { 
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => { 
            const fetchImages = data.hits;

            if (fetchImages.length === 0) { 
                iziToast.error({
                  message:'Sorry, there are no images matching your search query. Please try again!',
                  position: 'topRight',
                  backgroundColor: '#EF4040',
                  messageColor: 'white',
                  progressBarColor: '#B51B1B',
                  closeOnClick: true,
                  closeOnEscape: true,
                  close: true,
                  timeout: 3000,
                  maxWidth: '450px',
                });
                return;
            }

            gallery.innerHTML = createGalleryMarkup(fetchImages);
            lightbox.refresh();

        })
        .catch((error) => { 
            iziToast.error({
                title: 'Error',
                message: `An error occurred while fetching images: ${error.message}`,
                position: 'topRight',
            });
            console.error('Error fetching images:', error);
        })
        .finally(() => { 
            hideLoader();
            searchInput.value = '';
        });

});