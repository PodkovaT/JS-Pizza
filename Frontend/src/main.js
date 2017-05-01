$(function(){

    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    PizzaMenu.initialiseMenu();

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
