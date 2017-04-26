/**
 * Created by chaika on 09.02.16.
 */
exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'Вибір Піци',
        script: null,
        additional_scripts: null,
        additional_post_scripts: null
    });
};

exports.orderPage = function(req, res) {
    res.render('order', {
        pageTitle: 'Оформлення замовлення',
        script: 'order',
        additional_scripts: null,
        additional_post_scripts: [ 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTREwLDoX04q5CNwqeiPlB12tZr4seTn4&callback=initMap&language=uk&region=UA' ]
    });
};
