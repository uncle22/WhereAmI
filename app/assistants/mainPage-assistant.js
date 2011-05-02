/*
Copyright (c) 2011, Aled Davies
All rights reserved.

Redistribution and use in source and binary forms, with 
or without modification, are permitted provided that the
following conditions are met:

Redistributions of source code must retain the above copyright 
notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in 
the documentation and/or other materials provided with the distribution.

Neither the name of the copyright holder nor the names of its 
contributors may be used to endorse or promote products derived 
from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL 
THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS 
OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF 
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function MainPageAssistant() {

}

// The model
MainPageAssistant.prototype.model = {
	city: "",
	country: "",
	longitude: "",
	latitude: "",
	ip: ""
}

// Setup the mainPage
MainPageAssistant.prototype.setup = function() {
	// Create Widgets
	this.controller.setupWidget("whereAmIBtn", {}, {label : "Where Am I"}); 
	this.controller.setupWidget("showMap", {}, {label : "Show Map"}); 
	this.controller.setupWidget(Mojo.Menu.appMenu, 
								{}, whereAmI.appMenuModel);
	
	this.controller.setupWidget("mainPage_divSpinner", 
		{ spinnerSize : "large" }, 
		{ spinning : true });	
	
	// Register Event Listeners	
	Mojo.Event.listen(this.controller.get("whereAmIBtn"), 
					  Mojo.Event.tap, 
					  this.whereAmI.bind(this));
					
	Mojo.Event.listen(this.controller.get("showMap"), 
					  Mojo.Event.tap, 
					  this.showMap.bind(this));
	
	// Refresh the view based on the data in the model.
	this.refresh();	
};

// Refresh the view data based on the current state of the model.
MainPageAssistant.prototype.refresh = function() {
	$("mpTblDetails_City").innerHTML = this.model.city;
	$("mpTblDetails_Country").innerHTML = this.model.country;
	$("mpTblDetails_Location").innerHTML = this.model.longitude + " " + this.model.latitude;	
	$("mpTblDetails_IP").innerHTML = this.model.ip;	
}

// Event handler for the 'whereAmI' button.
MainPageAssistant.prototype.whereAmI = function() {
	$("mainPage_divScrim").show();
	
	new Ajax.Request( "http://freegeoip.net/json/", {
		method : "get", 
		evalJSON : "force", 
		parameters : {}, 
		onSuccess : function(inTransport) {
			$("mainPage_divScrim").hide();

			this.model.city = inTransport.responseJSON.city;
			this.model.country = inTransport.responseJSON.country_name;
			this.model.longitude = inTransport.responseJSON.longitude;
			this.model.latitude = inTransport.responseJSON.latitude;
			this.model.ip = inTransport.responseJSON.ip;	
			
			this.refresh();	
			
		}.bind(this), 
		onFailure : function(inTransport) {
			$("mainPage_divScrim").hide();
			Mojo.Controller.errorDialog("FAILURE: " + inTransport.status + " - " + inTransport.responseText);
		}, 
		onException : function(inTransport, inException) {
			$("mainPage_divScrim").hide();
			Mojo.Controller.errorDialog("EXCEPTION: " + inException);
		}
	}
	);
};

// Event handler for the 'showMap' button.
MainPageAssistant.prototype.showMap = function() {
	Mojo.Log.info("Opening map with: " + this.model.latitude + "," + this.model.longitude);
	
	if (this.model.latitude && this.model.longitude) {
		this.controller.serviceRequest("palm://com.palm.applicationManager", {
		  method:"launch",
		  parameters: {
		      id: "com.palm.app.maps",
		      params: {
		          query: this.model.latitude + "," + this.model.longitude
		      }
		  }
		}); 	
	} else {
		Mojo.Controller.errorDialog("No location to show map for");
	}
}

MainPageAssistant.prototype.activate = function(event) {};

MainPageAssistant.prototype.deactivate = function(event) {};

MainPageAssistant.prototype.cleanup = function(event) {};
