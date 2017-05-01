/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../storage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML елемент куди будуть додаватися піци
var $cart = $("#cart");
$cart.spin();

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    //console.log('addToCart');

    var cart_item = Cart.find(function (item) { return item.pizza.id == pizza.id && item.size == size; });
    if (!cart_item)
        Cart.push(cart_item = {
            pizza: pizza,
            size: size,
            quantity: 0
        });

    cart_item.quantity++;

    //console.log('addToCart', cart_item);

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    Cart.splice(Cart.indexOf(cart_item), 1);

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart(opts) {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його

    var stored_cart = Storage.get('cart');
    if (stored_cart)
        Cart = stored_cart;

    updateCart();
    $cart.spin(false);
}

function clearCart() {
    Cart = [];
    updateCart();
}

function isEmpty() {
    return !Cart || Cart.length === 0;
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    Storage.set('cart', Cart);

    //Очищаємо старі піци в кошику
    $cart.html("");
    var total = 0;

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {

        total += cart_item.pizza[cart_item.size].price * cart_item.quantity;

        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            ++cart_item.quantity;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus").click(function(){
            --cart_item.quantity;

            if (cart_item.quantity)
                updateCart();
            else
                removeFromCart(cart_item);
        });

        $node.find(".remove").click(function(){
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    $("#cart_total").html("Усього: " + Math.round(total, 2) + " грв");
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
exports.clearCart = clearCart;

exports.isEmpty = isEmpty;
