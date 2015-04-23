var eventproxy=require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');

var cnodeUrl = 'http://m.byr.cn/board/ParttimeJob/';

superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    $('li a').each(function (idx, element) {
      var $element = $(element);
//	console.log($element);
      var href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrls.push(href);
    });

    var ep = new eventproxy();

    ep.after('topic_html', topicUrls.length, function (topics) {
      topics = topics.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml);
        return ({
          title: $('li .f').text().trim(),
          href: topicUrl,
          content: $('div .sp').text().trim()
        });
      });

      console.log('final:');
      console.log(topics);
      fs.writeFile('message.txt',topics.title+'('+topics.href+')'+':\n'+topics.content+'\n\n',function(err){
	if(err) throw err;
	console.log('It is saved!');
});
    });

    topicUrls.forEach(function (topicUrl) {
      superagent.get(topicUrl)
        .end(function (err, res) {
          console.log('fetch ' + topicUrl + ' successful');
          ep.emit('topic_html', [topicUrl, res.text]);
        });
    });
  });
