var express = require('express');
var app = express();
var superagent = require('superagent');
var cheerio = require('cheerio');
var Url = 'http://m.byr.cn/board/ParttimeJob';
app.get('/',function(req,res,next){
	superagent.get(Url).end(function(err,sres){

	if(err){
		return next(err);	
	}
	
	var $ = cheerio.load(sres.text);
	var items = [];
	$('li a').each(function(idx,element)
	{
		var $element = $(element);
		console.log($element.html());
		if($element.attr('href').indexOf('article')==1)
		{	
		items.push({
			title:$element.text(),
			href:$element.attr('href')
		});
		}
	});
	
	res.send(items);
});
});


app.listen(3000, function () {
  console.log('app is listening at port 3000');
});
