let exec = require('child_process').execFile;

let electra = function(){
    console.log("Starting Wallet");
    exec(__dirname + '\\wallet\\Electra-qt.exe', function(err, data) {
        console.log(err)
        console.log(data);
    });
}
module.exports = { 
    electra
};