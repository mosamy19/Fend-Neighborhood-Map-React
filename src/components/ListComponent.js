import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ListComponent extends Component {
    // List component properties 
    static propTypes = {
        locations: PropTypes.array.isRequired,
        results: PropTypes.array.isRequired,
        markers: PropTypes.array.isRequired,
    }

    // when the user clicks on an item in the list elements it fires the InfoWindow on the map to display the place information
    onPlaceClick = (name) => {
        this.props.markers.map((marker) => {
            if (marker.title === name) {
                window.google.maps.event.trigger(marker, 'click');
            }
        })
    }


    // Firing the InfoWindow on the map to display the place information by pressing the enter key when the element is on focus
    onEnterClicked = (name, key) => {
        if (key == 13) {
            this.props.markers.map((marker) => {
                if (marker.title === name) {
                    window.google.maps.event.trigger(marker, 'click');
                }
            })
        }
    }


    render() {
        // List component properties  
        const { locations, results } = this.props;
        // Initializing locations list by adding locations
        let renderLocations = locations;

        // Toggle between displaing locations or search depending on the user input
        results.length > 0 ? (renderLocations = results) : (renderLocations = locations);

        return (
            <div className='list-container'>
                <h2>Neighborhood Map</h2>
                <input id="search-input" type="search" role="search" value={this.props.query} onChange={event => this.props.searchPlaces(event.target.value)} placeholder="Search for a location..." />

                <div className="locations-list">
                    {renderLocations && renderLocations.map((loc) => {
                        return <p tabIndex="0" className="location-item" onKeyUp={(event) => this.onEnterClicked(loc.venue.name, event.which)} onClick={() => this.onPlaceClick(loc.venue.name)} key={loc.venue.id}><i className="fas fa-map-marker-alt"></i> {loc.venue.name}</p>
                    })}
                </div>
            </div>
        )
    }
}


export default ListComponent;
