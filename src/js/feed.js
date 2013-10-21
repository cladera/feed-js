var Feed = function(options, context){
    this.context = context;
    this.options = options;
    
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