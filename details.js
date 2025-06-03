document.addEventListener('DOMContentLoaded', () => {
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


    const params = new URLSearchParams(window.location.search);
    const countryCode = params.get('country');

    if (!countryCode) {
        document.getElementById('country-detail').textContent = 'No country specified.';
        return;
    }


    fetch('countries.json')
        .then(res => res.json())
        .then(data => {
            const country = data.find(c => c.alpha3Code === countryCode);
            if (!country) {
                document.getElementById('country-detail').textContent = 'Country not found.';
                return;
            }
            displayCountryDetails(country, data);

        })
        .catch(err => {
            document.getElementById('country-detail').textContent = 'Error loading data.';
            console.error(err);
        });


    function displayCountryDetails(country, allCountries) {
        const container = document.getElementById('country-detail');
        container.innerHTML = `
      <img 
        src="${country.flags.png}" 
        alt="${country.name} Flag" 
        style="max-width: 500px; width: 100%; border-radius: 6px;" 
      />

      <div class="det-card">
        <h2>${country.name}</h2>
        
        <div class="det">
  <div class="det1">
    <p><span>Region:</span> ${country.region}</p>
    <p><span>Population:</span> ${country.population.toLocaleString()}</p>
    <p><span>Region:</span> ${country.region}</p>
    <p><span>Subregion:</span> ${country.subregion || 'N/A'}</p>
    <p><span>Capital:</span> ${country.capital}</p>
  </div>

  <div class="det1">
    <p><span>Top Level Domain: </span> ${country.topLevelDomain.join(', ')}</p>
    <p><span>Currencies:</span> ${country.currencies.map(c => c.name).join(', ')}</p>
    <p><span>Languages:</span> ${country.languages.map(l => l.name).join(', ')}</p>
  
</div>
        
      </div>
      <div class="borders">
            <strong>Border Countries:</strong>
            <div class="border-buttons">
              ${(country.borders && country.borders.length > 0)
                ? country.borders.slice(0, 3).map(code => {
                    const match = allCountries.find(c => c.alpha3Code === code);
                    return match
                        ? `<a href="details.html?country=${match.alpha3Code}"><button>${match.name}</button></a>`
                        : '';
                }).join('')
                : 'None'
            }
            </div>
          </div>
      </div>
    `;
    }
});
