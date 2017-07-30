// Establishment class constructor for list
var Establishment = function(data) {
  this.name = ko.observable(data.name);
  this.type = ko.observable(data.type);
  this.listDisplay = ko.observable(true);  // Boolean to determine whether establishment should appear in list
  this.marker = makeMarker(data); // refers to function in app.js to create and store Google Maps marker
};


var ViewModel = function () {
  var self = this;

  // This observable array will contain all establishments to be controlled by the view-model;
  // The array is created by looping through hard-coded establishment array in app.js.
  self.establishments = ko.observableArray([]);
  establishmentsData.forEach(function(establishmentItem) {
    self.establishments.push(new Establishment(establishmentItem));
  });

  // This obsevable array contains the list's filter options.
  self.establishmentCategories = ko.observableArray(['Show All','Restaurant','Hotel','Park','Museum']);

  // This observable records the selected filter option.
  self.selectedEstablishmentCategory = ko.observable();

  // This function filters the list and markers to only show what the user selects
  self.filterEstablishments = function() {
    // if needed, close current infowindow and stop bouncing marker
    if (largeInfoWindow != null) {
      largeInfoWindow.close();
      currentMarker.setAnimation(null); 
    }

    // loop through establishments to determine if each one should be visible in list
    self.establishments().forEach(function(establishment) {
      if (self.selectedEstablishmentCategory() == 'Show All') {
        establishment.listDisplay(true);
        // establishment.marker.setMap(map);
        establishment.marker.setVisible(true);
      } else {
        if (establishment.type() == self.selectedEstablishmentCategory()) { // determines if establishment type matches selectedEstablishmentCategory
          establishment.listDisplay(true);
          // establishment.marker.setMap(map);
          establishment.marker.setVisible(true);
        } else {
          establishment.listDisplay(false);
          // establishment.marker.setMap(null);
          establishment.marker.setVisible(false);
        }
      }
    });
    extendBoundaries();
  };

  // This function is executed when the user selects an establishment in the list.
  self.changeCurrentEstablishment = function(establishment) {
    changeCurrentMarker(establishment.marker);  // send establishment's marker to changeCurrentMarker function in app.js
    if (window.innerWidth < 600){  // close list-container when in mobile view
      listContainer.removeClass('list-container-open');
      hamburgerIcon.css('display','inline');
    }
  };

  // This observable will determine if the list panel should be visible or not based
  // on whether the hamburger icon or map has been clicked in mobile view.
  self.panelOpen = ko.observable(false);
  self.hamburgerClick = function() {
    self.panelOpen(true);
  };
  self.mapClick = function() {
    self.panelOpen(false);
  }

}; // end of ViewModel
