let getRequestsButton = document.getElementById('get-requests');
let clearWindowButton = document.getElementById('clear-window');
let checkLPPFiredStatusButton = document.getElementById('check-lpp-fired-status');
let checkCookieButton = document.getElementById("check-cookie");

// Clear the window
clearWindowButton.addEventListener('click', function() {
  document.getElementById('all-requests').innerText = "";
  document.getElementById('lpp-fired-status').innerText = "";
});


// Print all the requests
getRequestsButton.addEventListener('click', function() {
  let result = "";
  document.getElementById('all-requests').innerText = "";
  chrome.devtools.network.getHAR(
    function(request) {
      Object.values(request.entries).forEach(function (entry) {
        result += `<li id="requests">${entry.request.url}</li>`;
      });  
      document.getElementById('all-requests').innerHTML = `<ol>${result}</ol>`;    
    }
  );
});


// Check LPP fired status using network tracing and
// accessing cookie
checkLPPFiredStatusButton.addEventListener('click', function() {
  chrome.devtools.network.getHAR(
    function(request) {
      lppFired = false;
      console.log(request);
      Object.values(request.entries).forEach(function (entry) {
        console.log(entry.request.url);
        if (entry.request.url.includes("www.google.com/pagead/landing")) {
          lppFired = true;
        }
      });  
      if (lppFired) {
        document.getElementById('lpp-fired-status').innerText = "LPP is fired";  
      } else {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
          chrome.cookies.get({
            name: '_gcl_au',
            url: tabs[0].url
          }, function(cookie) {
              if (cookie) {
                document.getElementById('lpp-fired-status').innerText = "LPP is fired";
              } else {
                document.getElementById('lpp-fired-status').innerText = "LPP is not fired";
              }
            },
          );
        });
      }
    }
  );
});


// Access the _gcl_aw cookie and print it
checkCookieButton.addEventListener('click', async function () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    chrome.cookies.get({
      name: '_gcl_au',
      url: tabs[0].url
    }, function(cookie) {
        if (cookie) {
          document.getElementById('lpp-fired-status').innerText = `cookie value : ${cookie.value}`;
        } else {
          document.getElementById('lpp-fired-status').innerText = "Requested cookie is not present";
        }
      },
    );
  });
});