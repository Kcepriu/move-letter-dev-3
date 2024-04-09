import './css/styles.css';
import FetchImage from './js/fetchImage';
import TemplateHTML from './js/templateHTML';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
const throttle = require('lodash.throttle');

const fetchImage = new FetchImage();
const templateHTML = new TemplateHTML();
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

const refs = getElementsWIndow();

const observer = new IntersectionObserver(
  callbackObserver,
  getOptionObserver()
);

showButtonLoadMore(false);

// * Elements window
function getElementsWIndow() {
  return {
    searchForm: document.querySelector('.search-form'),
    inputBox: document.querySelector('.search-box'),
    gallery: document.querySelector('.gallery'),
    buttonFind: document.querySelector('.button__find'),
    buttonLoadMore: document.querySelector('.button__load-more'),
  };
}

// * NOTIFICATION
function showFailure(message) {
  Notify.failure(message);
}

function showInfo(message) {
  Notify.info(message);
}

// * Events
function addEvents() {
  refs.searchForm.addEventListener('submit', submitSearchForm);
  refs.buttonLoadMore.addEventListener('click', onClickButtonLoadMore);
}

function submitSearchForm(event) {
  event.preventDefault();

  clearGallery();
  showButtonLoadMore(false);

  const textQuery = getSearchQuery();

  fetchImage.curentTextQuery = textQuery;
  fetchImage.curentPage = 1;

  if (textQuery) {
    findImage();
  }
}

function onClickButtonLoadMore() {
  //Клік по кнопці завантажити більше
  fetchImage.curentPage += 1;
  //Запустити процедуру Пошуку/отримання наступної порції
  findImage();
}

// * element window
function getSearchQuery() {
  return refs.inputBox.value.trim();
}

function showButtonLoadMore(status) {
  // ПоказуєХоваєКнопку
  if (!status) {
    refs.buttonLoadMore.classList.add('hide');
  } else {
    refs.buttonLoadMore.classList.remove('hide');
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function findImage() {
  //Запускає процедуру пошуку наступної порції зображень.
  //Запит і номер сторінки вже лежать в обєкті

  try {
    const response = await fetchImage.getImage();
    const { hits: arrayFindElement, totalHits } = response.data;

    // console.log(response.data);
    // console.log('status', response.status);

    if (arrayFindElement.length) {
      //Якщо є дані то додаємо їх в кінець галереї
      //Дьоргаємо галерею щоб оновилася
      addImageToGallery(arrayFindElement);

      if (fetchImage.curentPage === 1) {
        //Якщо перша сторінкка то малюємо кнопку
        //і виводимо 'Hooray! We found totalHits images.';
        showButtonLoadMore(true);
        enableInfiniteScrolling();
        showInfo(`Hooray! We found ${totalHits} images.`);
      }
    } else {
      //Якщо даних нема то Ховаємо кнопку
      //Виводимо повідомлення
      showButtonLoadMore(false);
      disableInfiniteScroll();
      showFailure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    //Треба ховати кнопку
    showButtonLoadMore(false);
    disableInfiniteScroll();
    showFailure("We're sorry, but you've reached the end of search results.");
  }
}

function addImageToGallery(arrayDataElement) {
  const htmlText = templateHTML.getGallery(arrayDataElement);
  refs.gallery.insertAdjacentHTML('beforeend', htmlText);
  refreshGallery();
}

function refreshGallery() {
  lightbox.refresh();
}

// * SCROOL
function handleInfiniteScroll() {
  throttle(() => {
    const endOfPage =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
      onClickButtonLoadMore();
    }
  }, 1000)();
}

function enableInfiniteScrolling() {
  // window.addEventListener('scroll', handleInfiniteScroll);
  observer.observe(document.querySelector('.button__load-more'));
}

const disableInfiniteScroll = () => {
  // window.removeEventListener('scroll', handleInfiniteScroll);
  observer.unobserve(document.querySelector('.button__load-more'));
};

// function enableSmoothScroll() {
//   const { height: cardHeight } =
//     refs.gallery.firstElementChild.getBoundingClientRect();

//   console.log(cardHeight);
//   const cardHeight1 = window.innerHeight;

//   window.scrollBy({
//     top: cardHeight1,
//     behavior: 'smooth',
//   });
// }

//Observer

//-------------------------

function getOptionObserver() {
  return {
    root: null,
    rootMargin: '0px',
    threshold: 0.25,
  };
}

function callbackObserver(entries, observer) {
  /* Content excerpted, show below */
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onClickButtonLoadMore();
    }
  });
}
