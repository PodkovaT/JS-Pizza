/**
 * Created by chaika on 25.01.16.
 */
    function htmlbodyHeightUpdate(){
    	var height3 = $( window ).height()
		var height1 = $('.nav').height()+50
		height2 = $('.main').height()
		if(height2 > height3){
			$('html').height(Math.max(height1,height3,height2)+10);
			$('body').height(Math.max(height1,height3,height2)+10);
		}
		else
		{
			$('html').height(Math.max(height1,height3,height2));
			$('body').height(Math.max(height1,height3,height2));
		}

	}

$(function(){

    htmlbodyHeightUpdate();

    $( window ).resize(function() {
        htmlbodyHeightUpdate()
    });
    $( window ).scroll(function() {
        height2 = $('.main').height()
        htmlbodyHeightUpdate()
    });

    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();
});
