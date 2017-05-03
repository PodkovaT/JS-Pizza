/**
 * Liqpay Payment Module
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category        LiqPay
 * @package         smituk/liqpay
 * @version         3.0
 * @author          Liqpay
 * @copyright       Copyright (c) 2014 Liqpay
 * @license         http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 *
 * EXTENSION INFORMATION
 *
 * LIQPAY API       https://www.liqpay.com/ru/doc
 * Author website   http://stam.at/
 */

//var JSON = require('JSON2');
var crypto = require('crypto');
var _ = require('underscore');

var liqpay = function(public_key, private_key) {
  this.public_key = public_key;
  this.private_key = private_key;
  this.api_url = 'https://www.liqpay.com/api/';
  return this;
};

//нам потрібна лише функція шифрування
liqpay.prototype.encrypt = function(params) {
    var data = new Buffer(
        JSON.stringify(_.extend({}, params, {public_key: this.public_key}))
    ).toString('base64');

    var sha1 = crypto.createHash('sha1');
    var hash = sha1
            .update(this.private_key + data + this.private_key)
            .digest('base64');

    return {
        signature : hash,
        data : data
    };
};

module.exports = liqpay;
