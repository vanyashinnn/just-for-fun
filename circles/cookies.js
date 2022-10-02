function Cookies(){
  function setCookieDecade(name, val){
      var expires = new Date();       
      expires.setTime (expires.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
      var str = name + "=" + escape(val) + "; expires=" + expires.toGMTString();
      document.cookie = str;
  }
  function getCookie(key){
    var search = key + "="
    if (document.cookie.length > 0) { 
	// if there are any cookies
	offset = document.cookie.indexOf(search)
	if (offset != -1) { 
	    // if cookie exists
	    offset += search.length

	    // set index of beginning of value
	    end = document.cookie.indexOf(";", offset)

	    // set index of end of cookie value
	    if (end == -1)
		end = document.cookie.length
	    return unescape(document.cookie.substring(offset, end))
	}
    }
    return "";
  }
  function delCookie(name) {
    document.cookie = name + "=" + "; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
  this.add = function(key, object){  
    var jsonStr = JSON.stringify(object);
    setCookieDecade(key, jsonStr);
  }
  this.get = function(key){
    var jsonStr = getCookie(key);
    if(!jsonStr){
      return undefined;
    }
    return JSON.parse(jsonStr);
  }
  this.del = function(key){
     delCookie(key);
  }
}
