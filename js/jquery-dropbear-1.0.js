/**
 * Minify using http://www.refresh-sf.com/yui/#output
 * Author: Boris Cosic - boriscosic@gmail.com 
 * Version: 1.0
 */
(function($){  
	$.fn.dropbear = function(options) {  
 
		var defaults = {
			showTrigger: 'click',
			hideTrigger: 'mouseout',
			fnHide: null,
			position: 'absolute',
			linkTitle: 'Select'
		};  
		var settings = $.extend(defaults, options); 
	
		return this.each(function() {  
  			var child_el = $(this).attr('href');
  			$(this).addClass('dropbear');
  			
  			if($(child_el).length > 0) {
  				$(child_el).css({'padding':'0','margin':'0'});
  				$(child_el).hide();
  				
  				// bind the trigger for show and hide. the mouse out trigger is bound on the surroinding div.
  				$(this).bind(settings.showTrigger, showDrop);
  				$(this).bind(settings.hideTrigger, hideDrop);
  				
  				
  				$(child_el).mouseenter(function() { 
  					$(this).addClass('dropbearselected'); 
				}).mouseleave(function() {
  						dropCallback(settings.fnHide, $(this));
  						removeDrop($(this));
  				});
  			}
  			else {
  				if($(this).is('select')) {
  					$(this).hide();
  					var ts = Math.round((new Date()).getTime() / 1000);
  					
  					var drop = $('<ul style="padding:0;margin:0;" class="dropbear-select-wrapper"></ul>');
  					var opener = $('<a href="#'+$(this).attr('id')+'-'+ts+'" onclick="return false;" class="dropbear">'+settings.linkTitle+'</a>');
  					opener.bind(settings.showTrigger, showDrop);
  					opener.bind(settings.hideTrigger, hideDrop);
  					drop.append(opener);
  					
  					var list = $('<ul id="'+$(this).attr('id')+'-'+ts+'" style="padding:0;margin:0;display:none;position:'+settings.position+'"></ul>');
  					
  					list.mouseenter(function() { 
  						$(this).addClass('dropbearselected'); 
  					}).mouseleave(function() {
	  						dropCallback(settings.fnHide, $(this));
	  						removeDrop($(this));
	  				});
  					
  					var parent = $(this);
  					var index = 0;
  					
  					$(this).find('option').each(function() {
  						var attr = parent.attr('multiple'); 
  						var item = $('<li></li>');
  						
  						var input = $('<input type="'+((typeof attr !== 'undefined' && attr !== false)?'checkbox':'radio') +'" name="'+((typeof attr !== 'undefined' && attr !== false)?parent.attr('name')+'-'+index:parent.attr('name')) +'" value="'+$(this).val()+'" /> ');
  						
  						item.append(input);
  						item.append($(this).text());
  						list.append(item);
  						index++;
  					});
  					
  					
  					drop.append(list);
  					
  					drop.insertAfter($(this));
  				}
  			}
  			
    	});  
	};
	
	// show the child element. this plugin relies on the existing dom in place.
	function showDrop() {
		$(this).addClass('hover');
		var child_el = $(this).attr('href');
		$(child_el).show();
		return false;
	}
	
	// hide the child element.
	function hideDrop() {
		var child_el = $(this).attr('href');
		setTimeout(function() {		
			if(!$(child_el).hasClass('dropbearselected')) {
				removeDrop(child_el);
			}
		}, 150);
	}
	
	function removeDrop(el) {
		$(el).removeClass('dropbearselected');
		$(el).parent().find('a').removeClass('hover');
		$(el).hide();
	}
	
	function dropCallback(fnHide, el) {
		removeDrop(el);
		if(typeof fnHide == "function") {
			// put all parameter values in a ';' list.
			var valuesStr = $("input").map(function(){
				if($(this).attr('type') == 'checkbox' && $(this).attr('checked')) return $(this).val();
			}).get().join(";");

			fnHide.apply(el, [valuesStr]);
		}
	}
	 
})(jQuery); 