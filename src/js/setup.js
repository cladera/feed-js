$.widget("ui.feed", {
    options: {},
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
    }
});