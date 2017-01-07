---------------------------------------------------------
link css file
	<link rel="stylesheet" href="dist/css/style.css">
link jQuery and mySlider.js
	<script src = "dist/mySlider.js"></script>
---------------------------------------------------------
run function 
			createSlider({
				sliderElement: "#div1", // where to insert slider (string like css selector)
				quantSlide: 1, 			//how much to slide (1 - ...)
				slidesToShow:3, 		// how much to show (1-3)
				start: 0,
				end: 4
			});
---------------------------------------------------------


# Dummy Card API
Simple server exposing *dummy* data for display on cards.

## Usage
Simply run

    npm install
    npm start

and access ``http://127.0.0.1:3000/cards`` to get an array of data.

If you want to retrieve just a subset, specify the lower and upper limit as query parameters, for example:

    http://127.0.0.1:3000/cards?_start=8&_end=12
