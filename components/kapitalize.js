const config = require("../config.json");
const kapitalize = require('kapitalize')({
    user: config.kap_user,
    password: config.kap_pass,
    port: config.kap_port
})

let sendToAddress = function(addr, amt){
    kapitalize.auth(config.kap_user, config.kap_pass);
    kapitalize.sendtoaddress(addr, amt);
};

module.exports = { 
    sendToAddress
};

//  client.sendtoaddress('EcXbAeRBEo2Luk9mh5JmzLvDksajQfpwxo', 1)