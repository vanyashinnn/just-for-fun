function px(pixels){
  return pixels + "px";
}
var Month = {
  0: "Январь",
  1: "Февраль",
  2: "Март",
  3: "Апрель",
  4: "Май",
  5: "Июнь",
  6: "Июль",
  7: "Август",
  8: "Сентябрь",
  9: "Октябрь",
  10: "Ноябрь",
  11: "Декабрь"
}
var WeekDay = {
  0: "Воскресенье",
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота"
}
var WeekDayShort = {
  0: "Вс",
  1: "Пн",
  2: "Вт",
  3: "Ср",
  4: "Чт",
  5: "Пт",
  6: "Сб"
}
function DateObject(d, cls){
  var date = new Date(d);
  var classes = cls || "";
  this.getDayNumber = function(){
    return date.getDate();
  }
  this.getClasses = function(){
    return classes;
  }
  this.date = function(){
    return date;
  }
}
function Calendar(divId){
  var id = divId;
  var calendarId = id + "Calendar";
  var tableId = id + "Table";
  var rows = 7;
  var columns = 6;
  var dataArray = {};
  var date;
  var dates = new Array();
  var currentIdx = new Array();
  var currentMonth;
  var currentYear;
  var left = 0;
  var top = 0;
  var isShowInfo = false;
  var keyCode = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40
  }
  function setStyles(){
    //$(".info").css("left", px($("#calendar").offset().left));
    //$(".info").css("top", px($("#calendar").offset().top));
  }
  function index(row, column){
    return column*rows+row;
  }
  function coords(index){
    return [index%rows, index/rows];
  }
  function today(){
    var tmpDate = new Date();
    setCalendar(tmpDate);
  }
  function prevYear(){
    currentYear--;
    var tmpDate = new Date(currentYear, currentMonth, 1);
    //console.log(tmpDate);
    setCalendar(tmpDate);
  }
  function nextYear(){
    currentYear++;
    var tmpDate = new Date(currentYear, currentMonth, 1);
    //console.log(tmpDate);
    setCalendar(tmpDate);
  }
  function prevMonth(){
    currentYear = (currentMonth == 0)? (currentYear - 1) : (currentYear);
    currentMonth = (currentMonth+11)%12;
    var tmpDate = new Date(currentYear, currentMonth, 1);
    //console.log(tmpDate);
    setCalendar(tmpDate);
  }
  function nextMonth(){
    currentYear = (currentMonth == 11)? (currentYear + 1) : (currentYear);
    currentMonth = (currentMonth+1)%12;
    var tmpDate = new Date(currentYear, currentMonth, 1);
    //console.log(tmpDate);
    setCalendar(tmpDate);
  }
  function nextDay(){
    var tmpDate = new Date(dates[index(currentIdx[0], currentIdx[1])].date());
    tmpDate.setDate(tmpDate.getDate() + 1);
    //console.log(index(currentIdx[0], currentIdx[1]));
    //console.log(tmpDate);
    setCalendar(tmpDate);
  }
  function prevDay(){
    var tmpDate = new Date(dates[index(currentIdx[0], currentIdx[1])].date());
    tmpDate.setDate(tmpDate.getDate() - 1);
    //console.log(index(currentIdx[0], currentIdx[1]));
    //console.log(tmpDate);
    setCalendar(tmpDate);
  }
  function nextWeek(){
    var tmpDate = new Date(dates[index(currentIdx[0], currentIdx[1])].date());
    tmpDate.setDate(tmpDate.getDate() + 7);
    //console.log(tmpDate);
    setCalendar(tmpDate);
  }
  function prevWeek(){
    var tmpDate = new Date(dates[index(currentIdx[0], currentIdx[1])].date());
    tmpDate.setDate(tmpDate.getDate() - 7);
    //console.log(tmpDate);
    setCalendar(tmpDate);
  }
  function bindEvents(){
    $(".cell").unbind();
    $(document).unbind();
    $(".cell").mousedown(function(){
      var cell = $(this);
      if(!cell.attr("index")){
	  console.error("empty index");
	  return false;
      }
      var indexValue = cell.attr("index");
      // BUTTONS
      if(indexValue == "next-year"){
	nextYear();
	return false;
      }
      if(indexValue == "prev-year"){
	prevYear();
	return false;
      }
      if(indexValue == "next-month"){
	nextMonth();
	return false;
      }
      if(indexValue == "prev-month"){
	prevMonth();
	return false;
      }
      if(indexValue == "today"){
	today();
	return false;
      }
      if(indexValue == "info"){
	isShowInfo = !isShowInfo;
	console.log("info pressed")
	updateInfoStatus();
	return false;
      }
      // END OF BUTTONS
      var idx = indexValue.split("x");
      idx[0] = parseInt(idx[0]);
      idx[1] = parseInt(idx[1]);
      if(isNaN(idx[0]) || isNaN(idx[1])){
	console.error("invalid calendar index");
	return false;
      }
      currentIdx = idx.slice();
      var tmpDate = dates[index(currentIdx[0], currentIdx[1])].date();
      if(tmpDate.getMonth() != currentMonth){
	setCalendar(tmpDate);
	return false;
      }
      $("#"+calendarId+" td.active").removeClass("active");
      cell.addClass("active");
      updateInfoStatus();
      return false;
    });
    $(document).contextmenu(function(){
      return false;
    });
    $(document).keydown(function(evt){
      switch(evt.keyCode){
	case keyCode.up:
	  //currentIdx[0] = (currentIdx[0]-1+rows)%rows;
	  //clickToCurrIdx();
	  prevDay();
	  break;
	case keyCode.down:
// 	  currentIdx[0] = (currentIdx[0]+1)%rows;
// 	  clickToCurrIdx();
	  nextDay();
	  break;
	case keyCode.left:
	  //currentIdx[1] = (currentIdx[1]-1+columns)%columns;
	  //clickToCurrIdx();
	  prevWeek();
	  break;
	case keyCode.right:
	  //currentIdx[1] = (currentIdx[1]+1)%columns;
	  //clickToCurrIdx();
	  nextWeek();
	  break;
      }
    });
    $(window).resize(moveToCenter);
  }
  function getMaxX(){
    return ($("#"+id).width()-$("#"+calendarId).width());
  }
  function getMaxY(){
    return ($("#"+id).height()-$("#"+calendarId).height());
  }
  function updatePosition(){
    if( left < 0 ){ left = 0; }
    if( top < 0 ){ top = 0; }
    if( left > getMaxX() ){ left = getMaxX();}
    if( top > getMaxY() ){ top = getMaxY();}
    $("#"+calendarId).css("top", px(top));
    $("#"+calendarId).css("left", px(left));
  }
  function moveToCenter(){
    left = Math.floor( getMaxX()/2 );
    top = Math.floor( getMaxY()/2 );
    updatePosition();
  }
  function dateStr(idx){
    //console.log(idx);
    if(idx < 0 || dates.length < idx){
      console.error("bad index");
      return;
    }
    var monthName = Month[dates[idx].date().getMonth()];
    if(monthName.substr(-1) == "ь" || monthName.substr(-1) == "й"){
      monthName = monthName.substr(0, monthName.length-1)+"я";
    }else{
      monthName += "а";
    }
    return dates[idx].date().getDate() + " " + monthName + " " + dates[idx].date().getFullYear();
    //console.log(dates[idx].date());
  }
  function clickToCurrIdx(){
	cell(currentIdx[0], currentIdx[1]).mousedown();
  }
  function updateInfo(){
    $("#"+calendarId+" td.info").text(dateStr(index(currentIdx[0], currentIdx[1])));
  }
  function fillTable(){
    for(var column=0; column<columns; ++column){
      for(var row=0; row<rows; ++row){
	var idx = index(row, column);
	cell(row, column).addClass(dates[idx].getClasses());
	cell(row, column).text(dates[idx].getDayNumber());
	cell(row, column).attr("title", dateStr(idx));
      }
    }
    $("#"+calendarId+" td.year").text(currentYear);
    $("#"+calendarId+" td.month").text(Month[currentMonth]);
  }
  function infoTitle(){
    return (isShowInfo ? "Скрыть" : "Показать") + " информацию";
  }
  function updateInfoStatus(){
    if(isShowInfo){
      $("#"+calendarId+" td.info").show();
    }else{
      $("#"+calendarId+" td.info").hide();
    }
    $("#"+calendarId+" td[index=\"info\"]").attr("title", infoTitle());
    moveToCenter();
  }
  function update(){
    var element = "<div id=\""+calendarId+"\" class=\"calendar\">";
    element += "<table cellspacing=0>";
    element += "<tr>";
    element += "<td class=\"cell\" index=\"today\" title=\"Сегодня\"><i class=\"fa fa-calendar\"></i></td>";
    element += "<td class=\"cell\"></td>";
    element += "<td class=\"cell\"></td>";
    element += "<td class=\"cell\"></td>";
    element += "<td class=\"cell\"></td>";
    element += "<td class=\"cell\"></td>";
    element += "<td class=\"cell\" index=\"info\"><i class=\"fa fa-info\"></i></td>";
    element += "<td rowspan=" + (rows+3) + " class=\"cell evt info\"></td>";
    element += "</tr>";
    element += "<tr>";
    element += "<td class=\"cell\" index=\"prev-year\" title=\"Предыдущий год\">";
    element += "<i class=\"fa fa-arrow-circle-left\"></i>";
    element += "</td>";
    element += "<td class=\"cell year\" colspan="+(columns-1)+"></td>";
    element += "<td class=\"cell\" index=\"next-year\" title=\"Следующий год\">";
    element += "<i class=\"fa fa-arrow-circle-right\"></i>";
    element += "</td>";
    element += "</tr>";
    element += "<tr>";
    element += "<td class=\"cell\" index=\"prev-month\" title=\"Предыдущий месяц\">";
    element += "<i class=\"fa fa-arrow-circle-left\"></i>";
    element += "</td>";
    element += "<td class=\"cell month\" colspan="+(columns-1)+"></td>";
    element += "<td class=\"cell\" index=\"next-month\" title=\"Следующий месяц\">";
    element += "<i class=\"fa fa-arrow-circle-right\"></i>";
    element += "</td>";
    element += "</tr>";
    for(var row=0; row<rows; ++row){
      element += "<tr>";
      for(var column=0; column<=columns; ++column){
	if(column == 0){
	  element += "<td class=\"cell\" index=\"weekday-" + row + "\">"+WeekDayShort[(row+1)%7]+"</td>";
	}else{
	  element += "<td class=\"cell\" index=\""+row+"x"+(column-1)+"\"></td>";
	}
      }
      element += "</tr>";
    }
    element += "</table>";
    //element += "<div class=\"info\">info</div>";
    element += "</div>";
    $("#"+id).empty();
    $("#"+id).append(element);
    bindEvents();
    fillTable();
    setStyles();
    $("#"+calendarId+" .active").mousedown();
    updateInfo();
    moveToCenter();
  }
  function cell(row, column){
    return $("#"+calendarId+" td[index=\""+row+"x"+column+"\"]");
  }
  function setCalendar(_date){
    currentMonth = _date.getMonth();
    currentYear = _date.getFullYear();
    dates.length = 0;
    var tmpDate = new Date(_date);
    var day = new Date(_date);
    while(true){
      day.setDate(day.getDate()-1);
      if(
	day.getDay() == 1 && 
	(day.getMonth()+1)%12 == currentMonth ) 
      {
	break;
      }
    }
    for(var column=0; column<columns; ++column){
      for(var row=0; row<rows; ++row){
	var classes = "";
	if(day.getMonth() == currentMonth){
	  classes += " cm";
	}
	if(
	  day.getFullYear() == tmpDate.getFullYear() &&
	  day.getMonth() == tmpDate.getMonth() &&
	  day.getDate() == tmpDate.getDate()
	){
	  classes += " active";
	}
	if(
	  day.getFullYear() == date.getFullYear() &&
	  day.getMonth() == date.getMonth() &&
	  day.getDate() == date.getDate()
	){
	  classes += " cd";
	}
	if(day.getDay() == 6 || day.getDay() == 0){
	    classes += " we";
	}
	dates.push(new DateObject(day, classes));
	day.setDate(day.getDate()+1);
      }
    }
    update();
  }
  function init(){
    date = new Date();
    today();
  }
  init();
}
