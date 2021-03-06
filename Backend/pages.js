var secret = require('./secret');

exports.mainPage = function(req, res) {
    res.render('mainPage', initDefaults({
        pageTitle: 'Вибір Піци'
    }));
};

exports.orderPage = function(req, res) {
    res.render('order', initDefaults({
        pageTitle: 'Оформлення замовлення',
        script: 'order',
        additional_scripts: [ 'https://static.liqpay.com/libjs/checkout.js' ],
        additional_post_scripts: [ 'https://maps.googleapis.com/maps/api/js?key=' + secret.googleApiKey + '&callback=initMap&language=uk&region=UA' ]
    }));
};

function initDefaults(template_data) {

    if (!template_data.pageTitle)
    {
        template_data.pageTitle = null;
    }

    if (!template_data.script)
    {
        template_data.script = null;
    }

    if (!template_data.additional_scripts)
    {
        template_data.additional_scripts = null;
    }

    if (!template_data.additional_post_scripts)
    {
        template_data.additional_post_scripts = null;
    }

    return template_data;
}
