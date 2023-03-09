var debounce = require('lodash.debounce');

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/api';
import './css/styles.css';

const refs = {
  input: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onCountrySearch, DEBOUNCE_DELAY));

function onCountrySearch() {
  const trim = refs.input.value.trim();
  onClear();

  if (trim !== '') {
    fetchCountries(trim).then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        onRenderCountryList(data);
      } else if (data.length === 1) {
        onRenderCountry(data);
      } else if (data.length === 0) {
        Notify.failure('Oops, there is no country with that name');
      }
    });
  }
}

function onRenderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li class ="country">
                 <div class ="title">
                <img src="${country.flags.svg}" alt="${country.name.official}" width="40" height="30" />
                  <h2>${country.name.official}</h2>
                  </div>
            </li>`;
    })
    .join('');

  refs.countryList.innerHTML = markup;
}

function onRenderCountry(countries) {
  const markup = countries
    .map(country => {
      return `<li>
                <div class ="title">
                <img src="${country.flags.svg}" alt="${
        country.name.official
      }" width="40" height="30" />
                  <h2>${country.name.official}</h2>
                  </div>
                    <p><b>Capital</b>: ${country.capital}</p>
                    <p><b>Population</b>: ${country.population}</p>
                    <p><b>Languages</b>: ${Object.values(country.languages)}</p>
              </li>`;
    })
    .join('');

  refs.countryList.innerHTML = markup;
}

function onClear() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
