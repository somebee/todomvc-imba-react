(function(){
	// externs;
	
	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;
	
	// this way of caching is not the 'Imba way' - it is merely a very simple way
	// to do something similar to React 'shouldComponentUpdate'. You can implement
	// this however you want - you merely try to figure out whether anything have
	// changed inside tag#commit, and then rerender if it has.
	Imba.defineTag('todo','li', function(tag){
		
		tag.prototype.model = function (){
			return this.up(q$('._app',this)).model();
		};
		
		// commit is always called when a node is rendered as part of an outer tree
		// this is where we decide whether to cascade the render through to inner
		// parts of this.
		
		tag.prototype.commit = function (){
			// improvised alternative to React shouldComponentUpdate
			// you can do this however you want. In Imba there is really no reason
			// not to render (since it is so fast) - but to make it behave like
			// the react version we only render the content if we know it has changed
			if (renderAlways || this._hash != this.hash(this.object())) { return this.render() };
		};
		
		tag.prototype.hash = function (o){
			return "" + o.title + o.completed + this._editing;
		};
		
		tag.prototype.render = function (){
			var t0;
			var todo = this._object;
			this._hash = this.hash(todo);
			
			return this.flag('completed',(this.object().completed)).flag('editing',(this._editing)).setChildren(Imba.static([
				(t0 = this.$a || (this.$a = t$('div').flag('view'))).setContent(Imba.static([
					(t0.$$a = t0.$$a || t$('label').setHandler('dblclick','edit')).setContent(Imba.static([this.object().title],1)).end(),
					(t0.$$b = t0.$$b || t$('input').flag('toggle').setType('checkbox').setHandler('tap','toggle')).setChecked((this.object().completed)).end(),
					(t0.$$c = t0.$$c || t$('button').flag('destroy').setHandler('tap','drop')).end()
				],1)).end(),
				(this._input = this._input || t$('input').setRef('input',this).flag('edit').setType('text')).setObject(this.object()).end()
			],1)).synced();
		};
		
		tag.prototype.edit = function (){
			var self=this;
			this._editing = true;
			this._input.setValue(this.object().title);
			setTimeout(function() { return self._input.focus(); },10);
			return self.render(); // only need to render this
		};
		
		tag.prototype.drop = function (){
			return this.model().destroy(this.object());
		};
		
		tag.prototype.toggle = function (){
			return this.model().toggle(this.object());
		};
		
		tag.prototype.submit = function (){
			this._editing = false;
			var title = this._input.value().trim();
			return title ? (this.model().rename(this.object(),title)) : (this.model().destroy(this.object()));
		};
		
		tag.prototype.onfocusout = function (e){
			if (this._editing) { return this.submit() };
		};
		
		tag.prototype.cancel = function (){
			this._editing = false;
			this._input.blur();
			return this.render();
		};
		
		// onkeydown from inner element cascade through
		tag.prototype.onkeydown = function (e){
			e.halt();
			if (e.which() == ENTER_KEY) this.submit();
			if (e.which() == ESCAPE_KEY) { return this.cancel() };
		};
	});

})()