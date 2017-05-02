/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
$pizza_list.spin();

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        console.log('showOnePizza', $node, $node.find(".buy-big"));

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
    $pizza_list.spin(false);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown;

    if (filter) {
        pizza_shown =[];

        plist.forEach(function(pizza){
            //Якщо піка відповідає фільтру

            if (pizza.content[filter])
                pizza_shown.push(pizza);
        });
    } else
        pizza_shown = plist;

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

var plist = [];
function initialiseMenu() {
    //Показуємо усі піци
    Pizza_List(function (list) {
        plist = list;
        showPizzaList(plist);
    });
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
