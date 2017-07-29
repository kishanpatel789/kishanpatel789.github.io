# Neighborhood Map Project
The objective of this project was to  develop a single-page application featuring a map a neighborhood. Functionality was added to this application, including: map markers to identify popular locations, a filter function to easily discover these locations, and a listview to support simple browsing of all locations.

### Getting Started

To locally host and view the website on browser:

1. Download repository to computer.
2. Open index.html in a browser.

### Notes
* This project utilizes two APIs: [Google Maps](https://developers.google.com/maps/) and [Foursquare](https://developer.foursquare.com/).
* This project utilizes two Javascript libaries: [Knockout](http://knockoutjs.com/) (v3.4.2) and [jQuery](https://jquery.com/) (v3.2.1).
* This app contains two main parts:
  1. A list panel containing establishments.
  2. A Google map showcasing establishments with markers.
* Most of the app's features are defined within `app.js`.
* The list is populated and filtered by the Knockout framework in `viewmodel.js` based on establishment type.
