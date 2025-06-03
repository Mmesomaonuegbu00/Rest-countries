document.addEventListener('DOMContentLoaded', () => {
  const searchInput   = document.getElementById('search');
  const filterToggle  = document.getElementById('filter-toggle');
  const regionMenu    = document.getElementById('region-menu');
  const countryList   = document.getElementById('country-list');

  const toggleTheme = document.getElementById('toggle-theme');
  const body = document.body;
  const icon = toggleTheme.querySelector('i');
  const label = toggleTheme.querySelector('span');

  toggleTheme.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    icon.className = isDark ? 'fa-solid fa-sun' : 'far fa-moon';
    label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  });

  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => window.history.back());
  }


  let allCountries = [];
  let currentRegion = 'All';

  fetch('countries.json')
    .then(res => res.json())
    .then(data => {
      allCountries = data;
      const regions = [...new Set(data.map(c => c.region).filter(r => r))];
      regionMenu.innerHTML = `<li data-region="All">All</li>` + regions.map(region => `
        <li data-region="${region}">${region}</li>
      `).join('');
      renderCountries(data);
      console.log("Countries Array:", allCountries);
console.log("Filtered Countries:", filtered);
console.log("Current Region:", currentRegion);
    });

  searchInput.addEventListener('input', filterAndRender);
  filterToggle.addEventListener('click', () => regionMenu.classList.toggle('show'));

  regionMenu.addEventListener('click', (e) => {
    if (e.target.matches('li')) {
      currentRegion = e.target.dataset.region;
      filterToggle.childNodes[0].nodeValue = `${currentRegion === 'All' ? 'Filter by Region' : currentRegion} `;
      regionMenu.classList.remove('show');
      filterAndRender();
    }
  });

  function filterAndRender() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = allCountries.filter(c => { 
    const nameMatch = c.name.toLowerCase().includes(searchTerm);
    const regionMatch = currentRegion === 'All' || c.region === currentRegion;
    return nameMatch && regionMatch;
  });

  renderCountries(filtered);  
}
   


  function renderCountries(countries) {
    countryList.innerHTML = '';
    countries.forEach(country => {
      countryList.innerHTML += `
        <a href="details.html?country=${country.alpha3Code}" class="country-card">
          <img src="${country.flags.png}" alt="${country.name} flag" />
          <div class="text-container">
            <h3>${country.name}</h3>
            <p><span>Population:</span> ${country.population.toLocaleString()}</p>
            <p><span>Region:</span> ${country.region}</p>
            <p><span>Capital:</span> ${country.capital || 'N/A'}</p>
          </div>
        </a>
      `;
    });
  }
});
