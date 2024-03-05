(async function () {
    //input
    const searchInput = document.body.querySelector('#searchInput') as HTMLInputElement
    //buttons
    const searchBtn = document.body.querySelector('#searchBtn') as HTMLButtonElement
    const getAllBtn = document.body.querySelector('#getAllBtn') as HTMLButtonElement
    //statistics elements 
    const totalCountries = document.body.querySelector('#totalCountriesRes') as HTMLElement
    const totalCountriesPop = document.body.querySelector('#totalCountriesPopRes') as HTMLElement
    const averagePopulation = document.body.querySelector('#averagePopRes') as HTMLElement
    // tables elements
    const countriesTableBody = document.body.querySelector('#countriesTableBody') as HTMLElement
    const regionsTableBody = document.body.querySelector('#regionsTableBody') as HTMLElement
    const currenciesTableBody = document.body.querySelector('#currenciesTableBody') as HTMLElement
    // fetch all countries request
    async function fetchAllCountries(): Promise<country[]> {
        let response = await fetch('https://restcountries.com/v3.1/all')
        let data = await response.json()
        return data
    }
    //fetch country via name
    async function fetchCountriesByName(nameInput: string): Promise<country[]> {
        let response = await fetch(`https://restcountries.com/v3.1/name/${nameInput}`)
        let data = await response.json()
        return data
    }


    //print all countries stats to page
    async function getAllCountriesStats() {
        let countries = await fetchAllCountries()
        totalCountries.textContent = countries.length.toString()
        let totalPopulation = 0;
        for (let i = 0; i < countries.length; i++) {
            totalPopulation += countries[i].population;
        }
        totalCountriesPop.textContent = totalPopulation.toString();
        averagePopulation.textContent = (totalPopulation / countries.length).toString();
        populateCountriesTable(countries)
        populateRegionsTable(countries)
        populateCurrenciesTable(countries)
    }

    //print the searched countries stats to the page
    async function getSearchedCountriesStats() {
        let nameInput = searchInput.value
        searchInput.value = ''
        let countriesByName = await fetchCountriesByName(nameInput)
        totalCountries.textContent = countriesByName.length.toString()

        let totalPopulation = 0;
        for (let i = 0; i < countriesByName.length; i++) {
            totalPopulation += countriesByName[i].population;
        }
        totalCountriesPop.textContent = totalPopulation.toString()
        averagePopulation.textContent = (totalPopulation / countriesByName.length).toString()
        populateCountriesTable(countriesByName)
        populateRegionsTable(countriesByName)
        populateCurrenciesTable(countriesByName)
    }

    //populate country table function
    function populateCountriesTable(countries: country[]) {
        countriesTableBody.innerHTML = ''
        for (let i = 0; i < countries.length; i++) {
            countriesTableBody.innerHTML += `
            <tr>
                <td>${countries[i].name.common}</td>
                <td>${countries[i].population}</td>
            </tr>
            `
        }
    }
    //populate region table function
    function populateRegionsTable(countries: country[]) {
        regionsTableBody.innerHTML = ''
        let Asia = 0
        let Americas = 0
        let Europe = 0
        let Africa = 0
        let Oceania = 0

        for (let i = 0; i < countries.length; i++) {
            let regionName = countries[i].region
            if (regionName === 'Americas') {
                Americas++
            } else if (regionName === 'Asia') {
                Asia++
            } else if (regionName === 'Europe') {
                Europe++
            } else if (regionName === 'Africa') {
                Africa++
            } else {
                Oceania++
            }
        }

        const regionsCount = [Americas, Asia, Europe, Africa, Oceania]
        const regionsNames = ['Americas', 'Asia', 'Europe', 'Africa', 'Oceania']

        for (let i = 0; i < regionsCount.length; i++) {
            let tdRegionName = document.createElement('td')
            let tdRegionCount = document.createElement('td')
            const tr = document.createElement('tr')
            if (regionsCount[i] > 0) {
                tdRegionName.textContent = String(regionsNames[i])
                tdRegionCount.textContent = regionsCount[i].toString()
                tr.appendChild(tdRegionName)
                tr.appendChild(tdRegionCount)
                regionsTableBody.appendChild(tr)
            }

        }
    }
    //populate currency table function x_X
    function populateCurrenciesTable(countries: country[]) {
        currenciesTableBody.innerHTML = ''
        let currencyCount: { [key: string]: number } = {}
        countries.forEach(country => {
            if (country.currencies) {
                Object.keys(country.currencies).forEach(key => {
                    const currencyName = country.currencies[key].name

                    if (currencyCount[currencyName]) {
                        currencyCount[currencyName]++
                    } else {
                        currencyCount[currencyName] = 1
                    }

                });
            }
        });
        countries.forEach(country => {
            if (country.currencies) {
                Object.keys(country.currencies).forEach(key => {
                    const currency = country.currencies[key]
                    if (currency && currency.name) {
                        const tr = document.createElement('tr')
                        const tdCountryName = document.createElement('td')
                        const tdCurrencyName = document.createElement('td')
                        const tdCurrencyUseCount = document.createElement('td')

                        tdCountryName.textContent = country.name.common
                        tdCurrencyName.textContent = currency.name
                        tdCurrencyUseCount.textContent = (currencyCount[currency.name]).toString()
                        tr.appendChild(tdCountryName)
                        tr.appendChild(tdCurrencyName)
                        tr.appendChild(tdCurrencyUseCount)
                        currenciesTableBody.appendChild(tr)
                    }
                });
            }
        });
    }

    class country {
        name: { common: string };
        currencies: { [key: string]: { name: string } };
        region: string;
        population: number;
        constructor(name: { common: string }, currencies: { [key: string]: { name: string } }, region: string, population: number) {
            this.name = name;
            this.currencies = currencies;
            this.region = region;
            this.population = population;
        }
    }


    getAllBtn.addEventListener('click', async function () {
        await getAllCountriesStats()
    })

    searchBtn.addEventListener('click', async function () {
        getSearchedCountriesStats()

    })
})()