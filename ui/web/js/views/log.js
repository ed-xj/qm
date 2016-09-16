window.LogView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.rootlogpath = "../log"
        this.path = "../log"
    },

    events : {
        "click #logModal"           : "showLogModal",       // 
        "click #refresh-directory"  : "refreshDirectory",
        "click #parentFolder"       : "parentFolder",       // show parent folder content
        "click #isFolder"           : "expendFolder",       // show child folder content
        "click #isFile"             : "showtxtFile",         // show file
        "click #done"               : "doneBtnClick",
        "click #downloadLog"        : "htmltofile",
        "change #txt_START_DATE"	: "SearchTableHandler",
        "change #txt_END_DATE"		: "SearchTableHandler",
        "keyup #txt_SEARCH"		: "SearchTableHandler",
    },

    activate: function() {
        // this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },
	
    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    left: function (str, num)
    {
        return str.substring(0,num)
    },
    
    callBack: function(data) {
        if ( (data.StationID === "log") && (data.Cmd === "UPDATE") ) {
            var tree = data.Param
            var showTree = function(tree) {
                html += ('<td id="parentFolder">&nbsp;../</td></tr>')
                for (var i = 0; i < tree.length; i++) {
                    html += '<tr>'
                    if (!tree[i].isFile) {
                        html += ('<td id="isFolder"><i class="fa fa-folder" aria-hidden="true"></i> '+tree[i].name+'</td></tr>')
                    } else {
                        html += ('<td id="isFile"><i class="fa fa-file-text-o" aria-hidden="true"></i> '+tree[i].name+'</td></tr>')
                    }
                }
                html += '</tbody></table>'
            }
            var html = '<table class="table table-hover" id="log-table">'
            showTree(tree)
            $("#show-log-directory").html(html)
        }
        if ( (data.StationID === "log") && (data.Cmd === "LOGFILE") ) {
            $("#show-log-file P").hide()
            $("#show-log-file-title").text($(".info").text())
			$('#html-log-table>tbody').remove();
			var dataTable = $('#html-log-table');
			var len = data.Param.split(/(?:\r\n)/g)
            for (var i = 0; i < len.length; i++)
			{
				if (len[i].length > 18 && len[i][2] == '/')
				{
					var tr = $(document.createElement('tr'));
					var tdTime = $(document.createElement('td'));
					tdTime.text(formatDate(new Date(Date.parse(len[i].substring(0,17))),"yyyy-MM-dd hh:mm:ss"));
					tdTime.appendTo(tr);
					var tdData = $(document.createElement('td'));
					tdData.text(len[i].substring(18).trim());
					tdData.appendTo(tr);
					tr.appendTo(dataTable);
				}
            };
        }
    },

    SearchTableHandler: function (e) {
		var startDate = Date.parse($('#txt_START_DATE').val(), 10);
		var endDate = Date.parse($('#txt_END_DATE').val(), 10);
		var node = $('#html-log-table>tbody tr');
		for (var i=0,len=node.length;i<len;i++){
			// var columnDate = Date.parse(node[i].childNodes[0].innerText) || 0;
			var columnDate = Date.parse(node[i].childNodes[0].innerText);
			var searchDate = $('#txt_SEARCH').val().trim().toLowerCase();
			if (((isNaN(startDate) && isNaN(endDate)) ||
				(isNaN(startDate) && columnDate <= endDate) ||
				(startDate <= columnDate && isNaN(endDate)) ||
				(startDate <= columnDate && columnDate <= endDate)) &&
				(searchDate.length>0 && node[i].childNodes[1].innerText.toLowerCase().indexOf(searchDate)<0 ? false : true)) {
				node[i].hidden = false;
			}
			else {
				node[i].hidden = true;
			}
		}
	},
	
    showLogModal: function() {
        $("#Modal-log").modal({show: true});
        this.refreshDirectory(this.path)
    },

    onLangChange: function() {
        console.log('LogView::onLangChange');
        this.render()
    },

    parentFolder: function() {
        if (this.path != this.rootlogpath) {
            var dir = this.path.split("/")
            dir.pop()
            var path = ""
            for (var i = 0; i < dir.length; i++) {
                path += (dir[i].trim()+"/")
            }
            this.path = path
            var json = this.encodeJSON("OT", "LOG", "log", "getdirectory", path, "request for log directory");
            this.ajaxCall(this.ajaxUrl, json, "log", this.callBack);        
        }
    },

    refreshDirectory: function (path) {
        var json = this.encodeJSON("OT", "LOG", "log", "getdirectory", path, "request for log directory");
        this.ajaxCall(this.ajaxUrl, json, "log", this.callBack);
    },

    expendFolder: function (e) {
        this.path += ("/"+$(e.currentTarget).text().trim())
        var json = this.encodeJSON("OT", "LOG", "log", "getdirectory", this.path, "request for log directory");
        this.ajaxCall(this.ajaxUrl, json, "log", this.callBack);
    },

    showtxtFile: function (e) {
        $(".info").removeClass("info")
        $(e.currentTarget).addClass("info")
    },

    doneBtnClick: function() {
        var json = this.encodeJSON("OT", "LOG", "log", "getlogfile", this.path+"/"+$(".info").text().trim(), "request for log file");
        this.ajaxCall(this.ajaxUrl, json, "log", this.callBack);
    },

    htmltofile: function () {
		if($("#show-log-file-title").text().indexOf('.')>0)this.exportTableToCSV($('#html-log-table'),$("#show-log-file-title").text().trim().split('.')[0] + ".csv");
    },
	
	exportTableToCSV: function ($table, filename) {
		var $rows = $table.find('tr:has(td)');
		// Temporary delimiter characters unlikely to be typed by keyboard
		// This is to avoid accidentally splitting the actual contents
		tmpColDelim = String.fromCharCode(11); // vertical tab character
		tmpRowDelim = String.fromCharCode(0); // null character
		// actual delimiter characters for CSV format
		colDelim = '","';
		rowDelim = '"\r\n"';
		// Grab text from table into CSV formatted string
		var csv = '"';
		for (var i=0,len=$rows.length ; i<len ; i++){
			// var columnDate = Date.parse(node[i].childNodes[0].innerText) || 0;
			if (!$rows[i].hidden){
				csv += $rows[i].childNodes[0].innerText + colDelim + $rows[i].childNodes[1].innerText + rowDelim
			}
		}
		csv = csv.slice(0, -1);
/* 		
		// Grab text from table into CSV formatted string
		var csv = '"' + $rows.map(function (i, row) {
			var $row = $(row), $cols = $row.find('td');
			return $cols.map(function (j, col) {
				var $col = $(col), text = $col.text();
				return text.replace(/"/g, '""'); // escape double quotes
			}).get().join(tmpColDelim);
		}).get().join(tmpRowDelim).split(tmpRowDelim).join(rowDelim).split(tmpColDelim).join(colDelim) + '"';
*/
		// Data URI
		var uri = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);		
		var link = document.createElement('a');
		if (typeof link.download === 'string') {
			document.body.appendChild(link); // Firefox requires the link to be in the body
			link.download = filename;
			link.href = uri;
			link.click();
			document.body.removeChild(link); // remove the link when done
		} else {location.replace(uri);}
	},
});

function formatDate(date,format) {
	function LZ(x) {return(x<0||x>9?"":"0")+x}
	format=format+"";
	var result="";
	var i_format=0;
	var c="";
	var token="";
	var y=date.getYear()+"";
	var M=date.getMonth()+1;
	var d=date.getDate();
	var E=date.getDay();
	var H=date.getHours();
	var m=date.getMinutes();
	var s=date.getSeconds();
	var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
	// Convert real date parts into formatted versions
	var value=new Object();
	if (y.length < 4) {y=""+(y-0+1900);}
	value["y"]=""+y;
	value["yyyy"]=y;
	value["yy"]=y.substring(2,4);
	value["M"]=M;
	value["MM"]=LZ(M);
	value["d"]=d;
	value["dd"]=LZ(d);
	value["H"]=H;
	value["HH"]=LZ(H);
	if (H==0){value["h"]=12;}
	else if (H>12){value["h"]=H-12;}
	else {value["h"]=H;}
	value["hh"]=LZ(value["h"]);
	if (H>11){value["K"]=H-12;} else {value["K"]=H;}
	value["k"]=H+1;
	value["KK"]=LZ(value["K"]);
	value["kk"]=LZ(value["k"]);
	if (H > 11) { value["a"]="PM"; }
	else { value["a"]="AM"; }
	value["m"]=m;
	value["mm"]=LZ(m);
	value["s"]=s;
	value["ss"]=LZ(s);
	while (i_format < format.length) {
		c=format.charAt(i_format);
		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
			}
		if (value[token] != null) { result=result + value[token]; }
		else { result=result + token; }
		}
	return result;
};