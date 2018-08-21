import React, { Component } from 'react';
import ListComponent from './components/ListComponent';
import './App.css';
import escapeRegExp from "escape-string-regexp";

import axios from 'axios'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Locations: [],
      markers: [],
      results: [],
      query: "",

    }
  }


  componentDidMount() {
    // get locations when the component is ready
    this.getLocations();
  }

  // loadMap function for loading the maps javaScript API and initialize map
  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDG-L4Dw702c86tWlXr8KWjm4tw3Lqizno&callback=initMap");
    window.initMap = this.initMap;

  };

  // Fecting locations from Foursquare API
  getLocations = () => {
    // Url for requesting data
    const url = "https://api.foursquare.com/v2/venues/explore?"
    // Url Parameters for API credentials, location and version
    const params = {
      client_id: "DIPU5LXZ3DVHZ5PQ3W15GGHK4GXBYU4LH5PGRMMTIMHLEF1C",
      client_secret: "CQSDV003KWUU05GAUIXD42PC0BHXEMOGEV3ZB2AILBWHNAOG",
      near: "Alexandria, Egypt",
      v: "20182507"
    }
    // Getting the response data using axios package
    // Then add response to the Locations state property.
    // And firing loadMap function to initialize Map view
    axios.get(url + new URLSearchParams(params)).then(res => {
      this.setState({
        Locations: res.data.response.groups[0].items,
      }, this.loadMap)
    }).catch((err) => console.log("Error: ", err))
  }



  initMap = () => {
    // Add map Options for map object
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 31.1972473, lng: 29.9001642 },
      zoom: 14,
      fullscreenControl: false,
    });

    // initialize infowindow object
    let infowindow = new window.google.maps.InfoWindow()

    // Map in state Locations array and create a marker for each place
    this.state.Locations.map((loc) => {
      let marker = new window.google.maps.Marker({
        position: { lat: loc.venue.location.lat, lng: loc.venue.location.lng },
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: loc.venue.name,
      })
      
      // Push the marker to the markers state property.
      this.state.markers.push(marker)


      // Add place object to InfoWindow content
      let _venue = loc.venue;
      let content = `
        <div class="venue-info">
        <h2>${_venue.name}</h2>
        <p class="venue-loc"><i class="fas fa-map-marker-alt"></i> ${_venue.location.address}</p>
        <p  class="venue-cat"><i class="fas fa-fw fa-tag"></i> ${_venue.categories[0].name}</p>
      </div
      `

      // Add click event listener on each marker
      // To add content to infowindow and open this infowindow on the clicked marker
      marker.addListener('click', function () {
        infowindow.setContent(content)
        infowindow.open(map, marker)
      })
    })

  }


  // searchPlaces fired when the user type something in the search box
  // In the List component search box
  // Checking if written query characters is greater than 0,
  // then filter the written character(s) with places name than matches those characters
  // If query is empty it will return the full locations list.
  searchPlaces = query => {
    this.setState({ query: query });
    const locations = this.state.Locations;
    let searchResults;
    if (query.length > 0) {
      const match = new RegExp(escapeRegExp(query), "i");
      searchResults = locations.filter(place => match.test(place.venue.name));
      this.setState({ results: searchResults });
    } else {
      this.setState({ results: locations });
    }
  };


  // Show/Hide list menu on the mobile view when the user clicks on the hamburger menu icon
  displayList = () => {
    const menu = document.querySelector('.list-container')
    menu.classList.toggle("toggle")
  }

  // Show/Hide list menu on the mobile view by pressing the enter key when the hamburger menu container is on focus.
  onEnterClicked = (key) => {
    if (key == 13) {
      this.displayList();
    }
  }
  render() {
    return (
      <div className="App">
        <ListComponent query={this.state.query} markers={this.state.markers} results={this.state.results} searchPlaces={this.searchPlaces} locations={this.state.Locations} />
        <div className="map-container">
          <div id="map">
          </div>
        </div>
        <div tabIndex="0" aria-label="Places Menu" id="hamburger-menu" onKeyUp={(event) => this.onEnterClicked(event.which)} onClick={this.displayList}><i class="fas fa-lg fa-bars"></i></div>
      </div>
    );
  }
}


// Append Google maps Javascript API script to the index page
function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);

}
export default App;
