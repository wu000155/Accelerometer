(function(){
	// this sets the background color of the master UIView (when there are no windows/tab groups on it)
	Titanium.UI.setBackgroundColor('#000');

	var tabGroup = Titanium.UI.createTabGroup();
    //dont have to create tabGroup just in case
	var mainWindow = Titanium.UI.createWindow({
		title: "Yi Accelerometer",
		backgroundColor: "#FFF",
		fullscreen: false,	//[Android: makes the window a "heavyweight" window (thereby allowing the back button to work with it)]
		exitOnClose: true, //[Android: make the application exit if the back button is pressed from the main window]
		navBarHidden: false,
		tabBarHidden: true // hide tab bar
	});
	var tab = Titanium.UI.createTab({
		icon:'KS_nav_views.png', //Irrelevant; we are hiding the tab bar
		title:'Yi Wu', //Irrelevant; we are hiding the tab bar
		window:mainWindow //use mainWindow as default
	});
//add tab to tabGroup
	tabGroup.addTab(tab);

//set labelx labely labelz
var labelx = Ti.UI.createLabel({
  color:'black',
  font:{fontSize:20},
  top:20, left:10,
  width:300
  });
mainWindow.add(labelx);
var labely = Ti.UI.createLabel({
  color:'black',
  font:{fontSize:20},
  top:40, left:10,
  width:300
});
mainWindow.add(labely);
var labelz = Ti.UI.createLabel({
  color:'black',
  font:{fontSize:20},
  text:'-',
  top:60, left:10,
  width:300
});
mainWindow.add(labelz);


// create submit Btn
var submitButton = Ti.UI.createButton({
		   title: 'Submit',
		   top: 120,
		   font:{fontSize:25},
		   width: 100,
		   height: 50
});
mainWindow.add(submitButton);
// addEventListener to  submitButton
	submitButton.addEventListener("click", function(e){
	Ti.API.info(labelx.text);
	Ti.API.info(labely.text);	
	Ti.API.info(labelz.text);
//console log the labels
	var valueX = labelx.text.split(' ');
	var valueY = labely.text.split(' ');
	var valueZ = labelz.text.split(' ');
//split label text from "x: 0331232132"
	var x= valueX[1];
	var y= valueY[1];
	var z= valueZ[1];

	if(x!=null && y!=null && z!=null){
	  // HTTPClient error preservation
 	      var request = Titanium.Network.createHTTPClient();
		  var url = "http://www.octapex.com/codingtest/submit.php";
		  request.open("POST",url,true);
		    // open HTTPClient using POST method and async parameter is true
		  request.send({
		       'x': x,
		       'y': y,
		       'z': z,
		       'name': 'Yi Titanium',
		 });
		 // send data
		 
		 //Success callback function
		  request.onload = function(){
		
		 Ti.API.info(this.responseText);
		 //check responseText and show alert to users
		    if(this.responseText == "1"){
		      var alrt_Success = Titanium.UI.createAlertDialog({
		        title: 'Success!',
		        message: 'You have successfuly submitted accelerometer',
		        buttonNames: ['OK']
		      });
		      alrt_Success.show();
		    } else {
		      var alrt_Fail = Titanium.UI.createAlertDialog({
		        title: 'Error!',
		        message: 'Submit fall.  please try again later.',
		        buttonNames: ['OK']
		      });
		      alrt_Fail.show();
		    }
		  };
		  //error callback function
		   request.onerror = function(e){
		   	// console log error for debug
		   	 Ti.API.debug(e.error);
		         alert('error');
		   };
   	}

});
	
var accelerometerCallback = function(e) {
 // set text to label
  labelx.text = 'x: ' + e.x;
  labely.text = 'y: ' + e.y;
  labelz.text = 'z: ' + e.z;
};

if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1 ){
	// check if it support accelerometer
  alert('Accelerometer does not work on a virtual device');
} else {
  Ti.Accelerometer.addEventListener('update', accelerometerCallback);
  // add update event to get change labels
  
  if (Ti.Platform.name === 'android'){
  	// check Platform
    Ti.Android.currentActivity.addEventListener('pause', function(e) {
    	//use app lifecycle event to save battery
      Ti.API.info("removing accelerometer callback on pause");
      Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
    });
    Ti.Android.currentActivity.addEventListener('resume', function(e) {
      Ti.API.info("adding accelerometer callback on resume");
      Ti.Accelerometer.addEventListener('update', accelerometerCallback);
    });
  }
  // according to Titanium document, no need to check ios lifecycle because ios stop it automatically.
}
	// open tab group
	tabGroup.open();

})();