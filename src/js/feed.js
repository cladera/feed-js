var Feed = function(options, context){
    var self = this;
    this.context = context;
    this.options = options;
    this.running = false;
    this.lastCommentId = 0;
    this.lastAnswerId = 0;
    this.comments = {};
    this.answers = {}; //TODO: Necessary?
    this.orphanAnswers = {};
    this.commentsEndpoint = this.options.commentsEndpoint || 'http://localhost:3000/questions';
    this.answersEndpoint = this.options.answersEndpoint || 'http://localhost:3000/answers';
    this.context.addClass("feed");

    if(this.options.auto && this.options.refreshDelay > 0 ){
        this.running = true;
        this._getComments();
    }
};
Feed.prototype._renderMessage = function(author, body, datetime, className){
    className = className || 'comment';
    var box = $('<div class="'+className+'"></div>');
    box.append('<div class="author">' +
    '<span class="name">'+author+'</span>' +
    '</div>');
    box.append('<div class="datetime">'+this.options.renderDate.call(this, datetime)+'</div>');
    box.append('<div class="body">'+body || ''+'</div>');

    return box;
};

Feed.prototype.addComment = function(comment){
    if(this.comments.hasOwnProperty(comment.id)) {
        return;
    }
    var box = this._renderMessage(comment.author.name, comment.body, comment.datetime);
    box.append('<div class="answers"></div>');
    box.hide();
    this.context.prepend(box);
    box.fadeIn('slow');
    comment.context = box;
    comment.answers = {};
    this.comments[comment.id] = comment;
    if(comment.id > this.lastCommentId){
        this.lastCommentId = comment.id;
    }
    return this;
};
Feed.prototype.addAnswer = function (answer){
    var relatedComment = this.comments[answer.question_id];
    if(relatedComment){
        var self = this;
        var $answers = relatedComment.context.find('.answers');
        answer.context = self._renderMessage(answer.moderatorName, answer.body, answer.createdAt, 'comment answer');
        //Add answer to the DOM
        relatedComment.context.fadeOut(function(){
            $answers.append(answer.context);
            self.context.prepend(relatedComment.context);
            relatedComment.context.fadeIn('slow');
        });
        //Add answer to comment's dictionary
        relatedComment.answers[answer.id] = answer;
        if(answer.id > this.lastAnswerId){
            this.lastAnswerId = answer.id;
        }
    }else {
        //TODO: Orphan answers
    }
};

Feed.prototype.refreshDates = function(){
    var self = this;
    $.each(self.comments, function(i, comment){
        comment.context.children('.datetime').html(self.options.renderDate.call(self, comment.datetime));
        $.each(comment.answers, function(j, answer){
            answer.context.children('.datetime').html(self.options.renderDate.call(self, answer.createdAt));
        });
    });
};
Feed.prototype.refresh = function(){
    this._getComments();
};
Feed.prototype.stop = function(){
    this.running = false;
};
Feed.prototype.start = function(){
    if(this.running === true){
        return;
    }
    this.running = true;
    this._getComments();
};
Feed.prototype._getComments = function(){
    if(!this.commentsEndpoint) {
        throw new Error('Invalid comments endpoint');
    }
    var self = this;
    $.ajax({
        url: self.commentsEndpoint,
        dataType: 'json',
        data: self.options.idFilter+'='+self.lastCommentId
    })
        .done(function(feed){
            if(feed.length > 0){
                $.each(feed, function(key, comment){
                    if(!comment.author.name || comment.author.name === '' || comment.author.name === ' ') {
                        comment.author.name = comment.author.email.split('@')[0];
                    }
                    self.addComment(comment);
                });
            }
            self.refreshDates();
            self._getAnswers();
        })
        .error(function(){
            self.context.trigger('error');
            if(!self.options.haltOnError && self.running && self.options.refreshDelay > 0){
                setTimeout(function(){
                    if(self.running){
                        self._getComments();
                    }
                },self.options.refreshDelay*1000);
            }
        });
};
Feed.prototype._getAnswers = function(){
    if(!this.answersEndpoint) {
        throw new Error('Invalid answers endpoint');
    }
    var self = this;
    $.ajax({
        url: self.answersEndpoint,
        dataType: 'json',
        data: self.options.idFilter+'='+self.lastAnswerId
    })
        .done(function(feed){
            if(feed.length > 0){
                $.each(feed, function(key, answer){
                    if( typeof answer.id === 'string'){
                        answer.id = parseInt(answer.id,10);
                    }
                    if(!answer.moderatorName || answer.moderatorName === '' || answer.moderatorName === ' '){
                        answer.moderatorName = answer.moderatorEmail.split('@')[0];
                    }
                    self.addAnswer(answer);
                });
            }
            self.refreshDates();
            if(self.running && self.options.refreshDelay > 0){
                setTimeout(function(){
                    if(self.running){
                        self._getComments();
                    }
                },self.options.refreshDelay*1000);
            }
        })
        .error(function(){
            self.context.trigger('error');
            if(!self.options.haltOnError && self.running && self.options.refreshDelay > 0){
                setTimeout(function(){
                    if(self.running){
                        self._getComments();
                    }
                },self.options.refreshDelay*1000);
            }
        });

};