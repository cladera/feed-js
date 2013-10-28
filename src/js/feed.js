var Feed = function(options, context){
    var self = this;
    this.context = context;
    this.options = options;
    this.running = false;
    console.log("Loading source...");
    console.log("Source typeof: "+ typeof this.options.source);
    if(typeof this.options.source === "object"){
        console.log("Source array");
        //Render comments
        $.each(this.options.source, function(key, comment){
            self.add(comment);
        });
    }else if(typeof this.options.source === "string") {
        this.running = true;
        self._get();
    }else {
        console.error("Invalid source type");
    }
    this.context.addClass("feed");
};

Feed.prototype.add = function(comment){
    var box = $('<div class="comment"></div>');
    box.append('<div class="comment author">'+comment.author || ''+'</div>');
    box.append('<div class="comment body">'+comment.body || ''+'</div>');
    box.hide();
    this.context.prepend(box);
    box.fadeIn('slow');
    return this;
};
Feed.prototype.refresh = function(){
    this._get();
};
Feed.prototype.pause = function(){
    this.running = false;
};
Feed.prototype.resume = function(){
    this.running = true;
    this._get();
};
Feed.prototype._get = function(){
    if(typeof this.options.source === "string"){
        var self = this;
        $.ajax({
            url: self.options.source,
            dataType: 'json'
        }).done(function(feed){
            $.each(feed, function(key, comment){
                self.add(comment);
            });
            if(self.running && self.options.refreshDelay > 0){
                setTimeout(function(){
                    if(self.running){
                        self._get();
                    }
                },self.options.refreshDelay*1000);
            }
        });
    }
};