// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var endUrl;

var nextEpisode = true;
var nextSeason = false;


var epNum;
var seNum;
var nextEp;
var nextSe;

function navigate(url1, url2)
{
    // Creates an object which can read files from the server
        var reader = new XMLHttpRequest();

        var checkFor = url1;

        // Opens the file and specifies the method (get)
        // Asynchronous is true
        reader.open('get', checkFor, true);

        //check each time the ready state changes
        //to see if the object is ready
        reader.onreadystatechange = checkReadyState;

        function checkReadyState() {

            if (reader.readyState === 4) {

                //check to see whether request for the file failed or succeeded
                if ((reader.status == 200) || (reader.status == 0)) {
					
					
					chrome.tabs.update({
						url: url1
					});
					
					
					
					if (nextEpisode)
					{
						document.getElementById("check").innerHTML = "Next episode! S"+formatNum(seNum)+"E"+formatNum(nextEp)+" &#x1F44C;";
						document.getElementById("check").style.color = "green";
					}
					else if (nextSeason)
					{
						document.getElementById("check").innerHTML = "Next season! S"+formatNum(nextSe)+"E01 &#x1F44C;";
						document.getElementById("check").style.color = "green";
					}
					else
					{
						document.getElementById("check").innerHTML = "<b>Series completed!</b>";
						document.getElementById("check").style.color = "green";
					}
                }
                else {
					if (nextEpisode) 
					{
						nextSeason = true;
						nextEpisode = false;
					}
					else if (nextSeason)
						nextSeason = false;
					
                    navigate(url2, endUrl);
                return;

                }

            }//end of if (reader.readyState === 4)

        }// end of checkReadyState()

        // Sends the request for the file data to the server
        // Use null for "get" mode
        reader.send(null);
}
function formatNum(num)
{
	var n = parseInt(num);
	
	if (n < 10)
		return "0"+n;
	return n;
}
document.addEventListener('DOMContentLoaded', function() {

	
	
  chrome.tabs.getSelected(null, function(tab) {
    var url = tab.url;
	
	document.getElementById("check").innerHTML = "Something went wrong &#x1F44E;";
			document.getElementById("check").style.color = "red";
			
	if (url.substring(7,19) == "putlocker.is")
	{
		if (url.indexOf("-season-") * url.indexOf("-episode-") >= 0)
		{
			
			// indices of episode and season numbers
			var epNumIndex = url.indexOf("-episode-")+"-episode-".length;
			var seNumIndex = url.indexOf("-season-")+"-season-".length;
			
			// the actual episode and season numbers
			epNum = url.substring(epNumIndex, url.indexOf("-",epNumIndex));
			seNum = url.substring(seNumIndex, url.indexOf("-",seNumIndex));
			
			nextEp = parseInt(epNum)+1;
			nextSe = parseInt(seNum)+1;
			
			// final URLs of next episode and next season
			var nextEpURL = url.substring(0, epNumIndex) + nextEp +  url.substring(url.indexOf("-",epNumIndex), url.length);
			var nextSeURL = url.substring(0, seNumIndex) + nextSe +  "-episode-1"+url.substring(url.indexOf("-",epNumIndex), url.length);
			
			// if there is no next season
			endUrl = url.substring(0, url.indexOf("-tvshow")+"-tvshow".length) + url.substring(url.indexOf("-online-"));
			console.log("endURL: "+endUrl);
			
			navigate(nextEpURL, nextSeURL);
			
			
			
			document.getElementById("check").innerHTML = "All good &#x1F44C;";
			document.getElementById("check").style.color = "green";
			
		}
	}

  });
}, false);
