// Establishment class constructor for list view
var Establishment = function(data) {
  this.name = ko.observable(data.name);
  this.type = ko.observable(data.type);
  this.listDisplay = ko.observable(true);
  this.marker = makeMarker(data);
}


var ViewModel = function () {
  var self = this;

  // this observable array will contain all establishments to be controlled by the view-model
  self.establishments = ko.observableArray([]);
  establishmentsData.forEach(function(establishmentItem) {
    self.establishments.push(new Establishment(establishmentItem));
  });

  // this section filters the list and markers to only show what the user selects
  self.establishmentCategories = ko.observableArray(['Restaurant','Hotel','Park','Museum','Show All']);
  self.selectedEstablishmentCategory = ko.observable();
  self.filterEstablishments = function() {
    self.establishments().forEach(function(establishment) {
      if (self.selectedEstablishmentCategory() == 'Show All') {
        establishment.listDisplay(true);
        establishment.marker.setMap(map);
      } else {
        if (establishment.type() == self.selectedEstablishmentCategory()) { // determines if establishment types contains selectedEstablishmentCategory
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

  self.changeCurrentEstablishment = function(establishment) {
    changeCurrentMarker(establishment.marker);  // send establishment's marker to changeCurrentMarker function in app.js
    if (window.innerWidth < 600){  // close list-container when in mobile view
      listContainer.removeClass('list-container-open');
      hamburgerIcon.css('display','inline');
    }
  };
} // end of ViewModel
