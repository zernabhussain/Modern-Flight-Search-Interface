document.addEventListener('alpine:init', () => {
    AIRLINES_LOGO_MAPPING = { "BRITISH AIRWAYS": "static/img/BRITISH-AIRLINE.png", "EASYJET": "static/img/EASYJET.png", "WIZZ AIR": "static/img/WIZZ-AIR.png" } //We can take these urls form backend. 

    Alpine.data('flightSearch', () => ({
        flightType: 'round_trip',
        passengers: 1,
        flightClass: 'economy',
        sortField: 'price',
        showFilters: false,
        departureDate: '',
        returnDate: '',
        flights: [],
        filters: {
            stops: 'all',
            airlines: 'all',
            times: 'all',
            price: 'all',
            emissions: 'all',
            connectingAirports: 'all',
            duration: 'all'
        },

        init() {
            const today = new Date().toISOString().split('T')[0];
            // this.departureDate = today;
            // this.returnDate = today;

            document.addEventListener('htmx:afterRequest', (event) => {
                if (event.detail.target.id === 'flight-results' && event.detail.xhr.status === 200) {
                    const flights = JSON.parse(event.detail.xhr.response);
                    this.flights = flights;
                    this.renderFlightResults();
                }
            });
        },

        setFlightType(type) {
            this.flightType = type;
            if (type === 'one_way') {
                this.returnDate = '';
            }
        },

        setPassengers(count) {
            this.passengers = count;
        },

        setFlightClass(classType) {
            this.flightClass = classType;
        },

        applyFilters() {
            let filteredFlights = [...this.flights];

            // Apply filters
            if (this.filters.stops !== 'all') {
                filteredFlights = filteredFlights.filter(f =>
                    this.filters.stops === '0' ? f.number_of_stops === 0 : f.number_of_stops > 0
                );
            }

            if (this.filters.airlines !== 'all') {
                filteredFlights = filteredFlights.filter(f =>
                    f.airline.toLowerCase() === this.filters.airlines.toLowerCase()
                );
            }

            if (this.filters.times !== 'all') {
                filteredFlights = filteredFlights.filter(f => {
                    const hour = new Date(f.departure_dt).getHours();
                    switch (this.filters.times) {
                        case 'morning': return hour >= 5 && hour < 12;
                        case 'afternoon': return hour >= 12 && hour < 17;
                        case 'evening': return hour >= 17 && hour < 21;
                        case 'night': return hour >= 21 || hour < 5;
                        default: return true;
                    }
                });
            }

            this.renderFlightResults(filteredFlights);
        },

        sortFlights(field = this.sortField) {
            this.sortField = field;
            let sortedFlights = [...this.flights];

            sortedFlights.sort((a, b) => {
                switch (field) {
                    case 'price':
                        return a.price - b.price;
                    case 'duration':
                        return this.calculateDurationMinutes(a) - this.calculateDurationMinutes(b);
                    case 'departure':
                        return new Date(a.departure_dt) - new Date(b.departure_dt);
                    case 'emissions':
                        return a.emissions - b.emissions;
                    default:
                        return 0;
                }
            });

            this.renderFlightResults(sortedFlights);
        },

        calculateDurationMinutes(flight) {
            const departure = new Date(flight.departure_dt);
            const arrival = new Date(flight.arrival_dt);
            return (arrival - departure) / (1000 * 60);
        },

        renderFlightResults(flights = this.flights) {
            const resultsDiv = document.getElementById('flight-results');
            if (!flights || flights.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="text-center py-8">
                        <p class="text-gray-500 text-lg">No flights found matching your criteria.</p>
                    </div>
                `;
                return;
            }

            // Split flights into top options and others
            const topFlights = flights.slice(0, 5);
            const otherFlights = flights.slice(5);

            resultsDiv.innerHTML = `
                <div class="space-y-6">
                    <!-- Top Section -->
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <div>
                                <h2 class="text-lg font-semibold text-gray-900">Top departing options</h2>
                                <p class="text-sm text-gray-500">Ranked based on price and convenience</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-sm text-gray-600">Sort by:</span>
                                <select x-model="sortField" 
                                        @change="sortFlights()"
                                        class="border rounded-md px-3 py-1.5 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="price">Best price</option>
                                    <option value="duration">Duration</option>
                                    <option value="departure">Departure time</option>
                                    <option value="emissions">Emissions</option>
                                </select>
                            </div>
                        </div>
                        ${this.renderFlightTable(topFlights)}
                    </div>

                    <!-- Other Flights Section -->
                    ${otherFlights.length > 0 ? `
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900 mb-2">Other departing flights</h2>
                            ${this.renderFlightTable(otherFlights)}
                        </div>
                    ` : ''}
                </div>
            `;
        },

        renderFlightTable(flights) {
            return `
               <div class="rounded-lg border">
                <table class="w-full border-collapse "> 
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${flights.map(flight => this.renderFlightRow(flight)).join('')}
                    </tbody>
                </table>
                </div>
            `;
        },

        renderFlightRow(flight) {
            const departure = new Date(flight.departure_dt);
            const arrival = new Date(flight.arrival_dt);
            const duration = this.calculateDuration(departure, arrival);
            return ` 
                <tr class="hover:bg-gray-50 transition-colors  border">
                    <!-- Airline & Times -->
                    <td class="px-4 py-4 whitespace-nowrap w-[250px]">
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 flex-shrink-0">
                                <img src="${AIRLINES_LOGO_MAPPING[flight.airline]}" 
                                    alt="${flight.airline}" 
                                    class="w-10 h-10">
                            </div>
                            <div class="min-w-0">
                                <div class="text-sm font-medium truncate h-5 leading-5">
                                    ${this.formatTime(departure)} - ${this.formatTime(arrival)}
                                </div>
                                <div class="text-gray-500 text-xs h-4 leading-4 overflow-hidden">
                                    ${this.formatAirlineInfo(flight.airline)}
                                </div>
                            </div>
                        </div>
                    </td>

                    <!-- Duration -->
                    <td class="px-4 py-4 whitespace-nowrap w-[200px]">
                        <div class="text-sm font-medium">
                            ${duration}
                        </div>
                        <div class="text-gray-500 text-xs">
                            ${this.formatAirportCode(flight.source)} - ${this.formatAirportCode(flight.sink)}
                        </div>
                    </td>

                    <!-- Stops -->
                    <td class="px-4 py-4 whitespace-nowrap w-[120px]">
                        <div class="text-sm font-medium">
                            ${flight.number_of_stops === 0 ? 'Non-stop' :
                    `${flight.number_of_stops} stop${flight.number_of_stops > 1 ? 's' : ''}`}
                        </div>
                    </td>

                    <!-- Emissions -->
                    <td class="px-4 py-4 whitespace-nowrap w-[150px]">
                        <div class="text-sm font-medium">
                            ${flight.emissions} kg CO₂e
                        </div>
                        <div class="text-xs text-gray-500">
                            ${flight.number_of_stops > 0 ? '+19% emissions' : 'Avg emissions'}
                        </div>
                    </td>

                    <!-- Price -->
                    <td class="px-4 py-4 whitespace-nowrap text-right w-[120px]">
                        <div class="text-sm font-medium">
                            £${flight.price.toFixed(2)}
                        </div>
                        <div class="text-xs text-gray-500">
                            ${this.flightType}
                        </div>
                    </td>
                </tr> 
                `;
        },


        formatAirlineInfo(airline) {
            const airlineMap = {
                'BRITISH AIRWAYS': 'British Airways • BA Euroflyer',
                'EASYJET': 'easyJet • easyJet Europe',
                // Add more airlines as needed these are imited to demo
            };

            return airlineMap[airline] || airline;
        },

        formatAirportCode(airport) {
            const codes = {
                'London': 'LGW',
                'Amsterdam': 'AMS'
                // Add more airlines as needed these are imited to demo
            };
            return codes[airport] || airport?.slice(0, 3).toUpperCase(); // Airport short form can be improve by adding more correct codes. slicing the string is just to show proper UI  
        },

        calculateDuration(departure, arrival) {
            const diff = arrival - departure;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `${hours}h ${minutes} m`;
        },

        formatTime(date) {
            return date.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        },

        formatDate(date) {
            return date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
            });
        },

        swapLocations() {
            const form = document.getElementById('flight-search-form');
            const from = form.querySelector('[name="source"]');
            const to = form.querySelector('[name="sink"]');
            [from.value, to.value] = [to.value, from.value];
        }, 
    }));
});