/* 
	Author: Milan Stojanov, Gregor Grešak
	Author URL: http://www.milanstojanov.iz.rs, http://gresak.net
*/


;(function($) {

	var defaults = {

		limit: 3, 
		feedTag: 'article',
		titleTag: 'h3>a',		
		bodyTag: 'p',
		date:false,
                showText: true,
		rmText: false,
		boxTitle: "",
		boxTitleTag: "h2",
		utmCode: "",
		error: "Something wrong happened!"

	};

	$.fn.cdrss = function(src, options) {

		var config = $.extend({}, defaults, options),		
			$this = this.first(); 

		$this.init = function() {

			if(!src) { 
				$this.append(config.error);
				return;
			}				
			
			var feedUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20feed%20where%20url%3D'http%3A%2F%2Fover.net%2Ffeed'&format=json&diagnostics=false&callback=";
			
			$.ajax({
				type: 'GET',
				url: feedUrl,				
				//dataType: 'jsonp'								
			}).done(function(data) {
				console.log(data.query);
				if (data.query.count  > 0) {		
					displayData(data.query.results.item);						
				} else {
					$this.append('<p class="error">' + config.error + "</p>");
				};
			}); 
		}

		var displayData = function(feed) {
			var feeds = '';
			$.each(feed, function(i, e) {
				var image = $(e.description)[0].outerHTML;
				var contentSnippet =  $("<div>"+e.description+"</div>").text();
				feeds +="<" + config.feedTag + ">";

				feeds += formatTitle(e.title, e.link);
				if(config.date) 
					feeds += "<small>" +  formatDate(e.pubDate) + "</small>";
				feeds += "<" + config.bodyTag + "><a href='" + e.link + config.utmCode + "'>" + image;
                                if(config.showText)
                                            feeds +=  contentSnippet; 
                                feeds += "</a></" + config.bodyTag + ">";
				if(config.rmText) 
					feeds += readMore(e.link);
				feeds +="</" + config.feedTag + ">";
			});
			if(feeds.length > 0 && config.boxTitle.length > 0) {
				feeds = "<" + config.boxTitleTag + ">" + config.boxTitle + "</" + config.boxTitleTag + ">" + feeds;
			}
			
			$this.append(feeds);
		}
		
		var formatTitle = function(title, url) {
			var goodTitle;
			if(config.titleTag.indexOf('>') == -1 ) {
				if(config.titleTag == "a") 
					goodTitle = '<a href="' + url + config.utmCode +  '">' + title + '</a>';
				else
					goodTitle = '<' + config.titleTag + '>' + title + '</' + config.titleTag + '>';
			} else {
				var tags = config.titleTag.split('>'),
					firstTag = $.trim(tags[0]);				
				goodTitle = '<' + firstTag + '><a href="'+ url + config.utmCode +  '">' +  title + '</a></' + firstTag + '>';
			}
			return goodTitle;
		}		

		var readMore = function(url) {
			var link = '<a href="' + url + config.utmCode +   '">'+ config.rmText +'</a>'	
			// TODO if(config.rmClass) { Add class to the element and return! }				
			return link;
		}

		var formatDate = function(date) {			
			var date = new Date(date);

			var months = Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
		}
 
		$this.init();

		return $this;
		
	};

}(jQuery));

