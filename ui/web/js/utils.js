// The Template Loader. Used to asynchronously load templates located in separate .html files
window.templateLoader = {

    load: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

// Extend underscore's template() to allow inclusions
window.template = function(str, data) {
    // match "<% include template-id %>"
    return _.template(
        str.replace(
            /<%\s*include\s*(.*?)\s*%>/g,
            function(match, templateId) {
                var el = document.getElementById(templateId);
                return el ? el.innerHTML : '';
            }
        ),
        data
    );
};