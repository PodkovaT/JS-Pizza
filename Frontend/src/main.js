$(function(){

    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    PizzaMenu.initialiseMenu();

    $('.filters .btn').click(function () {
        var filter = $(this).data('filter');
        console.log('Filter', filter);
        PizzaMenu.filterPizza(filter);
    });

    $(".btn-group > .btn").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
    });

    var PizzaCart = require('./pizza/PizzaCart');
    PizzaCart.initialiseCart();
    $('#clearCart').click(PizzaCart.clearCart);
    $('#orderCart').click(function () {

        if (PizzaCart.isEmpty()) {
            console.log('Cart is empty!');
            window.alertify.error("Додайте товар до кошику для оформлення замовлення!");

            return false;
        }

        console.log('Cart is not empty');

        return true;
    });
});
