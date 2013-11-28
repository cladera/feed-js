(function($){
var Feed = function(options, context){
    var self = this;
    this.context = context;
    this.options = options;
    this.running = false;
    this.lastCommentId = 0;
    this.comments = [];
    if(typeof this.options.source === "object"){
        //Render comments
        $.each(this.options.source, function(key, comment){
            self.add(comment);
        });
    }else if(typeof this.options.source === "string") {
        if(this.options.auto){
            self.start();
        }
    }else {
        console.error("Invalid source type");
    }
    this.context.addClass("feed");
};

Feed.prototype.add = function(comment){
    var box = $('<div class="comment"></div>');
    box.append('<div class="author">' +
        '<span class="name">'+comment.author.name+'</span> <span class="email">&#60'+comment.author.email+'&#62</span>' +
        '</div>');
    box.append('<div class="datetime">'+this.options.renderDate.call(this, comment.datetime)+'</div>');
    box.append('<div class="body">'+comment.body || ''+'</div>');
    box.hide();
    this.context.prepend(box);
    box.fadeIn('slow');
    comment.context = box;
    this.comments.push(comment);
    if(comment.id > this.lastCommentId){
        this.lastCommentId = comment.id;
    }
    return this;
};
Feed.prototype.refreshDates = function(){
    var self = this;
    $.each(self.comments, function(i, comment){
        comment.context.find('.datetime').html(self.options.renderDate.call(self, comment.datetime));
    });
};
Feed.prototype.refresh = function(){
    this._get();
};
Feed.prototype.stop = function(){
    this.running = false;
};
Feed.prototype.start = function(){
    if(this.running === true){
        return;
    }
    this.running = true;
    this._get();
};
Feed.prototype._get = function(){
    if(typeof this.options.source === "string"){
        var self = this;
        $.ajax({
            url: self.options.source,
            dataType: 'json',
            data: self.options.idFilter+'='+self.lastCommentId,
        })
        .done(function(feed){
            if(feed.length > 0){
                $.each(feed, function(key, comment){
                    self.add(comment);
                });
            }
            self.refreshDates();
            if(self.running && self.options.refreshDelay > 0){
                setTimeout(function(){
                    if(self.running){
                        self._get();
                    }
                },self.options.refreshDelay*1000);
            }
        })
        .error(function(resp){
            self.context.trigger('error');
            if(!self.options.haltOnError && self.running && self.options.refreshDelay > 0){
                setTimeout(function(){
                    if(self.running){
                        self._get();
                    }
                },self.options.refreshDelay*1000);
            }
        });
    }
};
$.widget("ui.feed", {
    options: {
        renderDate: function(datetime){
            return datetime;
        },
        auto: false,
        refreshDelay: 0,
        source: [],
        idFilter: 'since',
        haltOnError: true
    },
    _create: function(){
        this.feed = new Feed(this.options, this.element);
    },
    destroy: function(){},
    _setOption: function(key, value){
        switch(key){
        }
    },
    add: function(comment){
        this.feed.add(comment);
    },
    refresh: function(){
        this.feed.refresh();
    },
    start: function(){
        this.feed.start();
    },
    stop: function(){
        this.feed.stop();
    }
});
})(jQuery);