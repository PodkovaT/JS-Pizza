var address;
$(function () {

    var PizzaCart = require('./pizza/PizzaCart');
    PizzaCart.initialiseCart();

    function clearCartAndGoToStart() {
        PizzaCart.clearCart();
        window.location = '/';
    }

    $('#orderCart').hide();
    $('#clearCart').click(clearCartAndGoToStart);

    $('form').submit(function (e) {

        //check if address is valid
        if ($('#eta').hasClass('bg-danger'))
        {
            alertify.error('Помилка - перевірте адресу!');
            return false;
        }

        //check if cart is not empty
        if (PizzaCart.isEmpty())
        {
            alertify.error('Помилка - кошик порожній!');
            return false;
        }

        var $orderPanel = $('#orderPanel');
        $orderPanel.spin();

        //post data to server and clear cart
        var api = require('./api');
        api.createOrder(
            {
                shipTo: { name: $('#name').val(), address: $('#address').val(), phone: $('#phone').val() },
                cart: PizzaCart.getPizzaInCart().map(function(item) {
                    return { pizza_id: item.pizza.id, size: item.size, quantity: item.quantity };
                })
            }, function (err, result) {

                if (err)
                    alertify.error('Помилка сервера - спробуйте ще раз пізніше');
                else {
                    LiqPayCheckout.init({
                      data: result.data,
                      signature: result.signature,
                      embedTo: "#orderPanel",
                      mode: "embed" // embed || popup,
                       }).on("liqpay.callback", function(data){
                            console.log(data.status);
                            console.log(data);
                            }).on("liqpay.ready", function(data){
                                // ready
                            }).on("liqpay.close", function(data){
                                // close
                    });

                    //clearCartAndGoToStart();
                }

                $orderPanel.spin(false);
            }
        )

        return false;
    });

    address = $('#address');
    address.change(function () {
        var addr = address.val();
        calculateTime(addr, function (err, result) {

            var $group = address.parent('.form-group');
            var $eta = $('#eta');

            if (err) {
                $eta.addClass('bg-danger');

                result = err.message;
            } else {
                $eta.removeClass('bg-danger');
            }

            $eta.text(result);
        });
    });
});

var ocean_plaza = {
    lat: 50.412,
    lng: 30.524
};

var geocoder, map;
var my_place;

function initMap() {
    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: ocean_plaza
    });
    var marker = new google.maps.Marker({
        position: ocean_plaza,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Ваша піцца!',
        icon: 'assets/images/map-icon.png'
    });

    map.addListener('click', function (e) {
        var location = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        console.log('Clicked here: ', location);

        if (!my_place)
            my_place = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                draggable: true,
                title: 'Ваша хата!',
                icon: 'assets/images/home-icon.png'
            });

        my_place.setPosition(location);
        geocoder.geocode({
            'location': location
        }, function (results, status) {
            console.log('results', results);
            console.log('status', status);

            if (status === 'OK') {
                if (results[0]) {
                    var addr = results[0].formatted_address;
                    address.val(addr);
                    address.trigger('change');
                } else
                    $('#addr_error').html('Адреси не знайдено!');
            } else
                $('#addr_error').html('Помилка сервісу Google: ' + status);
        });

    });
}

function calculateTime(address, done) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [ocean_plaza],
        destinations: [address],
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(Date.now() + 20 * 60 * 1000), // let us say it takes 20 minutes to cook a pizza
            trafficModel: 'optimistic'
        }
    }, timeCalculated(done));
}

function timeCalculated(done) {
    return function (response, status) {
        console.log('response', response);
        console.log('status', status);

        try {
            if (status === "OK") {

//                //Дозволяємо замовляти тільки на київську адресу
//                if (response.rows[0].elements[1].place_id !== "ChIJBUVa4U7P1EAR_kYBF9IxSXY")
//                    return done(null, new Error("Вибачте, але ми доставляємо піццу тільки по м. Київ"));

                var element = response.rows[0].elements[0];

                switch (element.status) {
                    case "OK":
                        var distance = element.distance.text;
                        var duration = element.duration.text;
                        //Math.round(element.distance.value / 100) / 10 + "км"
                        //Math.ceil(element.duration.value / 60) + " хвилин"

                        return done(null, "Відстань: " + distance + "   Орієнтовний час очікування: " + duration);

                    case "NOT_FOUND":
                        return done(new Error("Перевірте введену адресу - поточної не знайдено"));

                    default:
                        return done(new Error("До вас нам не доїхати :-("));
                }
            } else
                return done(new Error("Помилка сервісу: " + status));

        } catch (err) {
            console.error(err);
            return done(new Error("Невизначена помилка"));
        }
    };
}

window.initMap = initMap;
