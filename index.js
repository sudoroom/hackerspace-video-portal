
var $ = require('jquery-browserify');
var getUserMedia = require('getusermedia');
var PeerConnection = require('rtcpeerconnection');
var messenger = require('rtc-switchboard-messenger');
var signaller = require('rtc-signaller')(messenger('//juul.io:3000/'));

var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};

function beginStreaming() {
    console.log("starting stream");
    var pc = new PeerConnection();

    pc.on('streamAdded', function(stream) {
        $('#remoteVideo')[0].srcObject = stream;
    });
    
    getUserMedia({video: true}, function(err, stream) {
        var v = $('#localVideo')[0];
        v.src = createSrc(stream);
        v.play();
        
    });

}

function init() {

    // when a new peer is announced, log it
    signaller.on('peer:announce', function(data) {
        console.log('new peer found in room: ', data);
    });
    
    // for our sanity, pop a message once we are connected
    signaller.once('connected', beginStreaming);

    console.log("document init");

}
$(document).ready(init);
