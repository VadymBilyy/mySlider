function createSlider(params){
	
	/*=============options by default ================*/
	params.quantSlide = params.quantSlide || 1; 
	params.slidesToShow = params.slidesToShow || 3;
	params.start = params.start || 0;
	params.end = params.end || 8;
	
	var totalElements = params.end - params.start;

	// if num of slides < num slides to show -> num slides to show = num of slides
	params.slidesToShow = ( totalElements < params.slidesToShow ) ? totalElements:params.slidesToShow;



	$.ajax({
		url: 'http://127.0.0.1:3000/cards?_start=' + params.start + '&_end=' + params.end,
		type: 'GET',
		dataType: 'json',
	})
	.done(function(res) {//we recieve Array of objects {res.id, res.title, res.author, res.image_url}

		//when we recieved the data from server new elements are created based on view template
			var resultSlider = $(params.sliderElement); //parent element for slider (come from params of main function)
			var mainWrapper = $(" <div class='slider'></div> "); //"window" of slider
			var sliderContent = $("<div class='slider-content clearfix'></div>"); // where all slides are nested
			var controls = $("<div class='controls clearfix'><div class='ctrl-left'></div><div class='ctrl-right'></div></div>");
			
			for (var i = 0; i < res.length; i++){
				//Card design pattern
				var newElement = $("<div class='slider-item' id='" + res[i].id + "'><img src='" + res[i].image_url + "' alt=''><div class='content'><h2>" + res[i].title + "</h2><h4>What will you find here</h4><p>" + res[i].text + "</p><a href='void(0)'>Learn more</a></div></div>");
				
				sliderContent.append(newElement);//each iteration append new slider-item into container of slides

			};
			mainWrapper.append(sliderContent);//"slider-window" append container with slides
			mainWrapper.append(controls);//"slider-window" append controls block
			resultSlider.append(mainWrapper);//parent element append slider
			
			/*==================Width of the main wrapper ============================*/					
		$(params.sliderElement + " .slider").css("width", 343 * params.slidesToShow + "px");
	})
	.fail(function(err) {
		return err
	});




/*======================AFTER RENDERING=======================================*/

setTimeout(function ctrlMov(){ //giving time to render the html structure
	var ctrlLeft = $(params.sliderElement + " .ctrl-left"); //control left arrow
	var ctrlRight = $(params.sliderElement + " .ctrl-right"); //control right arrow
	var itemsLength = $(params.sliderElement + " .slider-item").length; // total numbers of elements in slider
	var offsetLeft = 0; // start position = 0 elements in overlow from the left side
	var offsetRight = itemsLength - params.slidesToShow; // start position = n elements in overlow from the left side
	var lastLeft = false; // flag of next last movement to left start position
	var lastRight = false; // flag of next last movement to right start position


	/*========================LEFT MOVEMENT=======================*/

	ctrlLeft.on("click", function(){ 
		/*changing the numbers of elements in overflow on each side*/
		offsetLeft += params.quantSlide; 
		offsetRight -= params.quantSlide;

			/*=============normal movement===========================*/
			// elements in overflow from left side < total num of elements - elements to show
    		if ( (offsetLeft <= itemsLength-params.slidesToShow) && (offsetRight >= 0) ){
    			var marLeft = $(params.sliderElement + " .slider-content").css("marginLeft");
    			$(params.sliderElement + " .slider-content").animate({ 						//movement by changing marginLeft
    						marginLeft: parseInt(marLeft) - 336 * params.quantSlide + "px"
    					});


			/*=============overflow more then 1 element===========================*/
			// if overflow > 1 element with step > 1, movement for numbers of element =  offsetRight before the current step

    		} else if ( (offsetLeft > itemsLength - params.slidesToShow) && (params.quantSlide != 1) && !(lastLeft)  && (offsetRight != -params.quantSlide)){ // overflow more then one element
    			var marLeft = $(params.sliderElement + " .slider-content").css("marginLeft");
    			$(params.sliderElement + " .slider-content").animate({
    						marginLeft: parseInt(marLeft) - 336 * (offsetRight + params.quantSlide) + "px"
    					});
    		//define the number of element in overflow on each side and flag, that the next movement is to inicial state
    			offsetRight = 0;
    			offsetLeft = itemsLength-params.slidesToShow;
    			lastLeft = true; //next move is to start position

			/*=============back to inicial position===========================*/
			//if step == 1 and we have overflow for 1 element -> go to start position
    		} else if ( (offsetLeft == (itemsLength - params.slidesToShow) + params.quantSlide) ){ 
    			$(params.sliderElement + " .slider-content").animate({
    						marginLeft: "0px"
    					});

    			offsetLeft = 0;
    			offsetRight = itemsLength - params.slidesToShow;
    			lastLeft = false;//null the last move flag
    		}
    }); //moveLeft func end


	/*========================RIGHT MOVEMENT=======================*/

	ctrlRight.on("click", function(){

		offsetLeft -= params.quantSlide;
		offsetRight += params.quantSlide;

		/*=============normal movement===========================*/

		if ( (offsetRight <= itemsLength-params.slidesToShow) && (offsetLeft >= 0) ){ //обычное движение влево
			var marLeft = $(params.sliderElement + " .slider-content").css("marginLeft");
			$(params.sliderElement + " .slider-content").animate({
						marginLeft: parseInt(marLeft) + 336 * params.quantSlide + "px"
					});


		/*=============overflow more then 1 step===========================*/

		} else if ( (offsetRight > itemsLength - params.slidesToShow) && (params.quantSlide != 1) && !(lastRight) && (offsetLeft != -params.quantSlide) ){ // если явный заскок при step >= 2
			var marLeft = $(params.sliderElement + " .slider-content").css("marginLeft");
			$(params.sliderElement + " .slider-content").animate({
						marginLeft: parseInt(marLeft) + 336 * (offsetLeft + params.quantSlide) + "px"
					});
			offsetRight = itemsLength - params.slidesToShow;
			offsetLeft = 0;
			lastRight = true;

		/*=============back to inicial position===========================*/

		} else if ( (offsetRight == (itemsLength - params.slidesToShow) + params.quantSlide) ){
				$(params.sliderElement + " .slider-content").animate({
				// width of one element * (num of all elements - num elements to show)
						marginLeft: -336 * (itemsLength - params.slidesToShow) + "px"
					});//336 - width of one element
			offsetRight = 0;
			offsetLeft = itemsLength - params.slidesToShow;
			lastRight = false;
		}
    }); //moveRight func end
	    
}, 200);


}//createSlider func end
    

/*==============================Example of using==============================*/
    
/*
createSlider({
	sliderElement: "#div1", // parent element for slider (where to insert slider)
	quantSlide: 2, 			// step (numbers of elements toslide every step)
	slidesToShow:2, 		// numbers of elements to show (change the width of parent element)
	start: 0,				// request elements from server, starting on this numbers
	end: 5					// request elements from server, ending on this numbers
});

*/
