import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '35176762-2be9ee229e20ac41850594eca';
const BASE_URL = 'https://pixabay.com/api/';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let currentPage = 1;
let searchQuery = '';

refs.loadMoreBtn.addEventListener('click', loadMore);
refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.trim();
  currentPage = 1;
  refs.gallery.innerHTML = '';
  const photos = await searchImages(searchQuery, currentPage);
  renderPhotoCards(photos);
  refs.loadMoreBtn.classList.remove('is-hidden');
}

async function searchImages() {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${currentPage}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Oops, something went wrong!');
  }
}

function renderPhotoCards(photos) {
  if (photos.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    let photoCardsHtml = '';
    photos.hits.forEach(photo => {
      photoCardsHtml += `
        <div class="photo-card">
          <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy">
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${photo.likes}</p>
            <p class="info-item"><b>Views:</b> ${photo.views}</p>
            <p class="info-item"><b>Comments:</b> ${photo.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${photo.downloads}</p>
          </div>
        </div>
      `;
    });
    refs.gallery.insertAdjacentHTML('beforeend', photoCardsHtml);
    const totalHits = photos.totalHits;
    const totalLoaded = currentPage * 40;
    if (totalLoaded >= totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }
}

async function loadMore() {
  currentPage += 1;
  const photos = await searchImages(searchQuery, currentPage);
  renderPhotoCards(photos);
}
