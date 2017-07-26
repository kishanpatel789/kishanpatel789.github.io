// Establishment class constructor for list view
var Establishment = function(data) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.geometry.location);
  this.types = ko.observableArray(data.types);
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

  self.establishmentCategories = ko.observableArray(['Restaurants','Hotels','Parks','Museums','Show All']);
  self.selectedEstablishmentCategory = ko.observable();
  self.filterEstablishments = function() {
    var establishmentGoogleType;
    switch (self.selectedEstablishmentCategory()) {
      case 'Restaurants':
        establishmentGoogleType = 'restaurant';
        break;
      case 'Hotels':
        establishmentGoogleType = 'lodging';
        break;
      case 'Parks':
        establishmentGoogleType = 'park';
        break;
      case 'Museums':
        establishmentGoogleType = 'museum';
        break;
      case 'Show All':
        establishmentGoogleType = 'everything';
        break;
      default:
        console.log('Error in filtering list.')
    }
    self.establishments().forEach(function(establishment) {
      if (establishmentGoogleType == 'everything') {
        establishment.listDisplay(true);
        establishment.marker.setMap(map);
      } else {
        if (establishment.types.indexOf(establishmentGoogleType) == -1) { // determines if establishment types contains selectedEstablishmentCategory
          establishment.listDisplay(false);
          establishment.marker.setMap(null);
        } else {
          establishment.listDisplay(true);
          establishment.marker.setMap(map);
        }
      }
    });
  };

  self.currentEstablishment = ko.observable();
  self.changeCurrentEstablishment = function(establishment) {
    self.currentEstablishment(establishment);
  };
}
