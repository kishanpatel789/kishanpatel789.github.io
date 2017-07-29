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
  self.establishmentCategories = ko.observableArray(['Restaurant','Hotel','Park','Museum','Show All']);

  // This observable records the selected filter option.
  self.selectedEstablishmentCategory = ko.observable();

  // This function filters the list and markers to only show what the user selects
  self.filterEstablishments = function() {
    self.establishments().forEach(function(establishment) {
      if (self.selectedEstablishmentCategory() == 'Show All') {
        establishment.listDisplay(true);
        establishment.marker.setMap(map);
      } else {
        if (establishment.type() == self.selectedEstablishmentCategory()) { // determines if establishment type matches selectedEstablishmentCategory
          establishment.listDisplay(true);
          establishment.marker.setMap(map);
        } else {
          establishment.listDisplay(false);
          establishment.marker.setMap(null);
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
}; // end of ViewModel
