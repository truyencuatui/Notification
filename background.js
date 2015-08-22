var xhr = new XMLHttpRequest();
var timer = null;

function getNotification(){
	
	clearTimeout(timer);
	timer = setTimeout(function(){
		getNotification();
	}, 10 * 60000);
	
	xhr.abort();
	xhr.open('GET', 'http://truyencuatui.net/sjax/noti');
	xhr.onload = xhr.onerror = function(){
		var response = xhr.status == 200 ? JSON.parse(xhr.response) : null;
		
		switch(response.action){
		
		case 'badge':
			chrome.browserAction.setBadgeText({ text: ''+ (response.message || '0') });
			break;
			
		case 'login':
			chrome.browserAction.setBadgeText({ text: 'auth' });
			break;
			
		default:
			console.warn(response.message);
			break;
		}
	};
	xhr.send();
}

chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.update(tab.id, {
		url: 'http://truyencuatui.net/truyen-cua-tui.html'
	});
});

chrome.webRequest.onCompleted.addListener(function(details){
	
	if(details.type == 'xmlhttprequest'){
		if(/sjax\/subscribe/i.test(details.url)){
			getNotification();
		}
	} else if(details.type == 'main_frame'){
		if(/truyen\/[a-z0-9-]+\/[a-z0-9-]*\/[0-9]+/gi.test(details.url)){
			getNotification();
		}
	}
	
}, {
	urls: ['<all_urls>']
});

getNotification();