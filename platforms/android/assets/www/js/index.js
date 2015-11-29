/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    onDeviceReady: function() {
        document.getElementById("placeToEat").innerHTML="Je sais pas, mais j'ai faim";
        var places=["Boulangerie","Casino","McDonalds","Daily Café","Subway","Green King","???"];
        var randomizeMenu=function() {
            var max=places.length;
            var min=0;
            return places[Math.floor(Math.random() * (max - min)) + min];//returns the value with random index
        };
        function shakeCallBack()
        {
            var placeToEat=randomizeMenu();
            document.getElementById("placeToEat").innerHTML=placeToEat;
        }
        var accelerometerHelper = new AccelerometerApp();
        accelerometerHelper.run();
        /* trying to detect a shake */
        /*var options = {
            frequency: 100
        };
        var watchId = null;
        var previousAcceleration = {
            x: null,
            y: null,
            z: null
        };

        var onError=function(){
            alert('not working');
        };
        var sensitivity = 30;
        watchId = navigator.accelerometer.watchAcceleration(assessCurrentAcceleration, onError, options);
        var assessCurrentAcceleration = function (acceleration) {
            var accelerationChange = {};
            if (previousAcceleration.x !== null) {
                accelerationChange.x = Math.abs(previousAcceleration.x - acceleration.x);
                accelerationChange.y = Math.abs(previousAcceleration.y - acceleration.y);
                accelerationChange.z = Math.abs(previousAcceleration.z - acceleration.z);
            }

            previousAcceleration = {
                x: acceleration.x,
                y: acceleration.y,
                z: acceleration.z
            };
            document.getElementById("placeToEat").innerHTML=""+previousAcceleration.x+"-"+previousAcceleration.y+"-"+previousAcceleration.z;
            if (accelerationChange.x + accelerationChange.y + accelerationChange.z > sensitivity) {
                // Shake detected
                shakeCallBack();
            }
        };*/




        //app.receivedEvent('deviceready');

    }
    // Update DOM on a Received Event
    /*receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }*/
};

function AccelerometerApp() {

}

AccelerometerApp.prototype = {
    watchID : null,
    spanX : null,
    spanY: null,
    spanZ: null,
    spanTimeStamp: null,
    lastKnownAcceleration:{x:null,y:null,z:null},
    spanAccelerationChange:null,
    placeToEat:null,
    places:null,

    run: function() {
        var that = this;

        that.spanX = document.getElementById("spanDirectionX");
        that.spanY = document.getElementById("spanDirectionY");
        that.spanZ = document.getElementById("spanDirectionZ");
        that.spanTimeStamp = document.getElementById("spanTimeStamp");
        that.spanAccelerationChange = document.getElementById("spanAccelerationChange");
        that.placeToEat = document.getElementById("placeToEat");
        that.places=["Boulangerie","Casino","McDonalds","Daily Café","Subway","Green King","???"];
        that._startWatch();
    },

    // Start watching the acceleration
    _startWatch: function() {
        // Only start testing if watchID is currently null.
        var that = this;
        if (that.watchID === null) {
            // Update acceleration every .5 second
            var options = { frequency: 500 };
            that.watchID = navigator.accelerometer.watchAcceleration(function() {
                    that._onAccelerometerSuccess.apply(that, arguments)
                },
                function(error) {
                    that._onAccelerometerError.apply(that, arguments)
                },
                options);
        }
    },

    // Stop watching the acceleration
    _stopWatch: function() {
        var that = this;
        if (that.watchID !== null) {
            var emptyText = "";
            navigator.accelerometer.clearWatch(that.watchID);
            that.watchID = null;
            that.spanX.textContent = emptyText;
            that.spanY.textContent = emptyText;
            that.spanZ.textContent = emptyText;
            that.spanTimeStamp.textContent = emptyText;
        }
    },

    //Get a snapshot of the current acceleration
    _onAccelerometerSuccess: function(acceleration) {
        var that = this;
        /*that.spanX.textContent = acceleration.x;
        that.spanY.textContent = acceleration.y;
        that.spanZ.textContent = acceleration.z;
        that.spanTimeStamp.textContent = acceleration.timestamp;*/
        var accelerationChange={x:0,y:0,z:0};
        if(that.lastKnownAcceleration.x !==null){
            accelerationChange.x=Math.abs(that.lastKnownAcceleration.x - acceleration.x);
            accelerationChange.y=Math.abs(that.lastKnownAcceleration.y - acceleration.y);
            accelerationChange.z=Math.abs(that.lastKnownAcceleration.z - acceleration.z);
        }
        that.lastKnownAcceleration.x=acceleration.x;
        that.lastKnownAcceleration.y=acceleration.y;
        that.lastKnownAcceleration.z=acceleration.z;
        /*that.spanAccelerationChange.textContent="at least : "+(accelerationChange.x+accelerationChange.y+accelerationChange.z);*/
//        that.placeToEat.textContent = "yolo";
        if((accelerationChange.x+accelerationChange.y+accelerationChange.z) > 30.0){
            var max=that.places.length;
            var min=0;
            var rdm=(Math.floor(Math.random() * (max - min)) + min);
//            that.placeToEat.textContent = "not that yolo "+that.places[rdm];
            that.placeToEat.textContent = that.places[rdm];//returns the value with random index
        }

    },

    //Failed to get the acceleration
    _onAccelerometerError: function(error) {
        //check if we're running in simulator
        if (window.navigator.simulator === true)
        {
            alert(error);
            this._stopWatch.apply(this, arguments);
        } else
            alert("Unable to start accelerometer! Error code: " + error.code );
    }
}
app.initialize();