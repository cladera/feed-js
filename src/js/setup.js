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