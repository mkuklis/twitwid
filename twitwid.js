if (twitwid == undefined) {
  var twitwid = function($) {
    var themes = {
      "dots": ".dots { padding:5px; border-bottom:1px dashed #eee; } ", 
      "bluesky": ".bluesky { background-color:#9FB0FF; padding:5px; margin-bottom:1px; }",
      "mouse": ".mouse { background-color:#eee; padding:5px; margin-bottom:1px; width:200px; font-size:10px; }"
      };
    
    //process src params
    var QSObject = function(querystring) {
        // create regular expression object to retrieve the qs part 
        var qsReg = new RegExp("[?][^#]*","i"); 
        hRef = unescape(querystring); 
        var qsMatch = hRef.match(qsReg); 
        
        // removes the question mark from the url 
        qsMatch = new String(qsMatch); 
        qsMatch = qsMatch.substr(1, qsMatch.length -1); 
        var params = {};
        //split it up 
        var rootArr = qsMatch.split("&"); 
        for (i = 0; i < rootArr.length; i++) { 
            var tempArr = rootArr[i].split("="); 
            if (tempArr.length == 2) { 
                tempArr[0] = unescape(tempArr[0]); 
                tempArr[1] = unescape(tempArr[1]); 
                params[tempArr[0]]= tempArr[1];
            }
        }
        return params;
    };
    
    // create twitwid
    var create = function () {
      var scriptTag = $('.twitwid');
      for (var k = 0; k < scriptTag.size(); k++) {
          var el = $(scriptTag[k]);
          var container = el.parent();
          
          // lets process params
          var qs = QSObject(el.attr('src'));
    
          //TODO check if name was provided
          var name = qs.name;
          var size = (qs.size != undefined) ? qs.size : 10;
          var theme = (qs.theme != undefined) ? qs.theme : "bluesky";
          // load template
          loadTheme(theme);
          var params = {"container": container, "theme": theme};
          
          $.jTwitter(name, size, function(posts, params) {
            var html = '';
            for (var i = 0; i < posts.length; i++) {
              html += '<div class="' + params.theme + '">' + posts[i].text + '</div>';
            }
            $(params.container).append(html);
            $("." + params.theme).clickUrl().clickTwitter();
          }, params);
      }
    };
    
    $.fn.clickUrl = function() {
      var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
      this.each(function() {
        $(this).html(
          $(this).html().replace(regexp,"<a href=\"$1\">$1</a>")
        );
      });
      return $(this);
    };
    
    $.fn.clickTwitter = function() {
      var regexp = /@(\w+)/gi
      this.each(function() {
        $(this).html(
          $(this).html().replace(regexp,"@<a href=\"http://twitter.com/$1\">$1</a>")
        );
      });
      return $(this)
    }
    
    // loads theme
    var loadTheme = function (theme) {
      if (themes[theme] != undefined) {
        $('head').append('<style>' + themes[theme] + '</style>');
      }
    };
    
    return {
      create : create
    };
  };

  var jsloader = function() {
    
    // load js
    function loadScript(src, callback) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      var loaded = false;
      script.setAttribute('src', src);
      script.onload = script.onreadystatechange = function() {
        if (!loaded && (!this.readyState || this.readyState == 'complete' || this.readyState == 'loaded') ) {
          loaded = true;
          callback();
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);
        }
      }
      head.appendChild(script);
    }
    
    // load jquery from google
    function loadJQuery(cb) {
      loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js',
        function() {
          cb(jQuery.noConflict(true));
        }
      );
    }

    // execute load jquery
    loadJQuery(function(jQuery) {
       // load jTwitter plugin
        (function($){$.extend({jTwitter:function(username,numPosts,fnk,params){if(numPosts=='undefined'){fnk=numPosts;numPosts=5}var url="http://twitter.com/status/user_timeline/"+username+".json?count="+numPosts+"&callback=?";var info={};$.getJSON(url,function(data){if(typeof fnk=='function'){if(params!=undefined)fnk.call(this,data,params);else{fnk.call(this,data)}}})}})})(jQuery);
        jQuery(document).ready(function(){
          twitwid(jQuery).create();
        });
      });
  }();  
}