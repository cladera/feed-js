$.widget("ui.feed", {
    options: {
        source: [],
        refreshDelay: 0
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
    pause: function(){
        this.feed.pause();
    },
    resume: function(){
        this.feed.resume();
    }
});