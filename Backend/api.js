/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var secret = require('./secret');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

var order_id = 20000;
exports.createOrder = function(req, res) {

    var order = ++order_id;

    var order_info = req.body;
    console.log("Creating Order", order, order_info);

    var description = '';
    var total = 0;
    var size2text = { 'small_size': 'мала', 'big_size': 'велика' };

    order_info.order_items.forEach(function (order_item) {
        var pizza = Pizza_List.find(function (p) { return order_item.pizza_id == p.id; });
        total += pizza[order_item.size].price * order_item.quantity;

        description += pizza.title + ' (' + size2text[order_item.size] + ') - ' + order_item.quantity + ' шт. \r\n';
    });

    description += '==================\r\n';
    description += 'Замовник: ' + order_info.shipTo.name + '(+380' + order_info.shipTo.phone + ')\r\n';
    description += 'Доставка за адресою: ' + order_info.shipTo.address;

    var LiqPay = require('./liqpay');
    var liqpay = new LiqPay(secret.liqpayPublicKey, secret.liqpayPrivateKey);
    var payload = {
        'action'         : 'pay',
        'amount'         : total,
        'currency'       : 'UAH',
        'description'    : description,
        'order_id'       : order + '',
        'version'        : 3,
        'language'       : 'uk',
        'sandbox'        : '1'
    };

    console.log('Payload for liqpay:', payload);

    var result = liqpay.encrypt(payload);

    console.log('Signed data for liqpay:', result);

    result.success = true;

    res.send(result);
};
