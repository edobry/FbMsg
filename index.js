var util = require("util"),
	request = require("request"),
	config = require("./config.json")
	creds = require("./creds.json"),
	template = require("./request.json");



var process = function(res) {
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

var headerString = Object.keys(template.headers).map(function(name) {
 		return util.format("-H '%s:%s'", name, template.headers[name]); 
 	}).join(' ');

template.formdata.__user = creds.messagerId;
template.formdata.__dyn = creds.dyn;

template.formdata["messages[user_ids][" + creds.messageeId + "][offset]"] = config.offset;
template.formdata["messages[user_ids][" + creds.messageeId + "][limit]"] = config.window;
var formdataString = Object.keys(template.formdata)
	.map(function(key) {
		return util.format("%s=%s", key, template.formdata[key]); 
	}).join("&"); 

template.headers.cookie = creds.cookie;
template.headers.referer = creds.referer;

var options = {
	uri: template.endpoint,
	headers: template.headers,
	method: "POST",
	gzip: true,
	body: formdataString
};
request(options, function(err, res, body) {
	if(err) {
		console.log(err);
		return;
	}

	process(body);
});

