/**
 * Created by diana on 12.01.16.
 */

var api = require('./api');

var pizza_info = [];

function get_pizza_info(callback) {
    api.getPizzaList(function (err, data) {
        if (err) {
            console.error('Could not get pizza data from server', err);
            pizza_info = [];
        } else
            pizza_info = data;

        callback(pizza_info);
    });
};

module.exports = get_pizza_info;
