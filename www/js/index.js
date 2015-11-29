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
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        document.getElementById("placeToEat").innerHTML="Je sais pas, mais j'ai faim";
        var accelerometerHelper = new AccelerometerApp();
        accelerometerHelper.run();
    }
};

function AccelerometerApp() {

}

AccelerometerApp.prototype = {
    watchID : null,
    lastKnownAcceleration:{x:null,y:null,z:null,t:null},
    spanAccelerationChange:null,
    placeToEat:null,
    places:null,

    run: function() {
        var that = this;
        that.placeToEat = document.getElementById("placeToEat");
        that.places=["Boulangerie","Casino","McDonalds","Daily Café","Subway","Green King","L'olivier","???"];
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
        }
    },

    //Get a snapshot of the current acceleration
    _onAccelerometerSuccess: function(acceleration) {
        var that = this;
        var shouldIchange=true;
        var accelerationChange={x:0,y:0,z:0};
        if(that.lastKnownAcceleration.x !==null){
            accelerationChange.x=Math.abs(that.lastKnownAcceleration.x - acceleration.x);
            accelerationChange.y=Math.abs(that.lastKnownAcceleration.y - acceleration.y);
            accelerationChange.z=Math.abs(that.lastKnownAcceleration.z - acceleration.z);
        }
        that.lastKnownAcceleration.x=acceleration.x;
        that.lastKnownAcceleration.y=acceleration.y;
        that.lastKnownAcceleration.z=acceleration.z;
        if(that.lastKnownAcceleration.t !== null)
            shouldIchange=((that.lastKnownAcceleration.t+500) < acceleration.timestamp);
        that.lastKnownAcceleration.t=acceleration.timestamp;
        if((accelerationChange.x+accelerationChange.y+accelerationChange.z) > 30.0){
            var max=that.places.length;
            var min=0;
            var rdm=(Math.floor(Math.random() * (max - min)) + min);
            if(shouldIchange) {
                that.placeToEat.textContent = that.places[rdm];//returns the value with random index
            }
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
};
app.initialize();