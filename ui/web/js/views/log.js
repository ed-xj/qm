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
        "click #downloadLog"        : "htmltoCSV"
    },

    activate: function() {
        // this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

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
            $("code").show()
            $("#show-log-file-title").text($(".info").text())
            var codetable = "<table class='table-condensed table-striped' id='html-log-table'><tbody>"
            var len = data.Param.split(/(?:\r\n|\r|\n)/g)
            for (var i = 1; i < len.length-1; i++) {
                codetable+=("<tr><th style='vertical-align: top; text-align: left;'>"+(i)+"</th><td>"+len[i+1]+"</td></tr>")
            };
            codetable += "</tbody></table>"
            $("code").html(codetable)            
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

    htmltoCSV: function () {
        var csv='"';
        tab = $('#html-log-table > tbody > tr > td') // id of table
        var spl
        for(var j = 0 ; j < tab.length ; j++) 
        {
            spl = tab[j].innerText.split(" >> ")
            csv+=(spl[0]+"','"+spl[1]+"'\r\n'")
        }

        // csv= csv.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        // csv= csv.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
        // csv= csv.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        // var ua = window.navigator.userAgent;
        // var msie = ua.indexOf("MSIE "); 

        // if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        // {
        //     txtArea1.document.open("txt/html","replace");
        //     txtArea1.document.write(csv);
        //     txtArea1.document.close();
        //     txtArea1.focus(); 
        //     sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
        // }  
        // else                 //other browser not tested on IE 11
        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);            
        window.open(uri+";filename="+ $('#show-log-file-title').text().slice(0, -4)+".csv,"); 
        // var filename = $('#show-log-file-title').text().slice(0, -4)+".csv";
        // $('#show-log-file-title').append("<a id='download' href='"+uri+"' download='"+filename+"'>a</a>")

        // downloadLink.href = uri;
        // downloadLink.download = $('show-log-file-title').text().slice(0, -4)+".csv";
        // $("#download").attr({
        //         'download': $('#show-log-file-title').text().slice(0, -4)+".csv",
        //         'href': uri
        // })

        // $("#download").click();
//         $("#download").remove()
    }
});