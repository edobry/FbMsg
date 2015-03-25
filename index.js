var util = require("util"),
	request = require("request"),
	creds = require("./creds.json");

var endpoint = "https://facebook.com/ajax/mercury/thread_info.php";
var headers = {
	origin: "https://www.facebook.com",
	"accept-encoding": "gzip, deflate",
	"accept-language": "en-US,en;q=0.8,ru;q=0.6",
	cookie: creds.cookie,
	pragma: "no-cache",
	"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36",
	"content-type": "application/x-www-form-urlencoded",
	accept: "*/*",
	"cache-control": "no-cache",
	referer: creds.referer,
	dnt: 1
};
var headerString = Object.keys(headers).map(function(name) {
 		return util.format("-H '%s:%s'", name, headers[name]); 
 	}).join(' ');

var formdata = {
	"client": "web_messenger",
	"__user": creds.messagerId,
	"__a": 1,
	"__dyn": creds.dyn,
	"__req": "u",
	"fb_dtsg": "AQGl8dXaRf8F",
	"ttstamp": 2658171108561008897821025670,
	"__rev": 1655994
};
formdata["messages[user_ids][" + creds.messageeId + "][offset]"] = 161;
formdata["messages[user_ids][" + creds.messageeId + "][limit]"] = 80;
var formdataString = Object.keys(formdata).map(function(key) { return util.format("%s=%s", key, formdata[key]); }).join("&");

var process = function(res) {
	//console.log(res);
	var data = JSON.parse(res.substring(9));

	console.log(data.payload.actions.map(function(msg) {
	  return {
	    author: msg.author == "fbid:" + creds.messagerId ? creds.messagerName : creds.messageeName,
	    content: msg.body
	  };
	}).map(function(msg) {
		return util.format("%s: %s", msg.author, msg.content);
	}).join('\n'));
};

var options = {
	uri: endpoint,
	headers: headers,
	method: "POST",
	gzip: true,
	body: formdataString
};
//console.log("Req: ", options);
request(options, function(err, res, body) {
	if(err) {
		console.log(err);
		return;
	}

	// console.log('STATUS: ' + res.statusCode);
	// console.log('HEADERS: ' + JSON.stringify(res.headers));

	process(body);
});

