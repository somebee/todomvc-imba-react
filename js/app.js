(function(){
	function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;
	
	Todos = new TodoModel('imba-todos');
	
	Imba.defineTag('app', function(tag){
		
		tag.prototype.hash = function (){
			return window.location.hash;
		};
		
		tag.prototype.model = function (){
			return this._model;
		};
		
		tag.prototype.build = function (){
			var self=this;
			self._counter = 0;
			self._model = Todos;
			self._model.load();
			self._model.subscribe(function() { return self.render(); });
			window.addEventListener('hashchange',function() { return self.render(); });
			self.render();
			return self;
		};
		
		tag.prototype.onkeydown = function (e){
			var value, v_;
			if (e.which() != ENTER_KEY) { return };
			
			if (value = e.target().value().trim()) {
				this.model().addTodo(value);
				return (e.target().setValue(v_=""),v_);
			};
		};
		
		
		tag.prototype.toggleAll = function (e){
			return this.model().toggleAll(e.target().checked());
		};
		
		// remove all completed todos
		tag.prototype.clearCompleted = function (){
			q$$('.toggle-all',this).setChecked(false);
			return this.model().clearCompleted();
		};
		
		
		tag.prototype.render = function (){
			var t0, self=this, t1, t2;
			this._counter++;
			var all = this.model().items();
			var active = all.filter(function(todo) { return !todo.completed; });
			var done = all.filter(function(todo) { return todo.completed; });
			
			var items = {'#/completed': done,'#/active': active}[this.hash()] || all;
			
			return this.setChildren(Imba.static([
				(t0 = this.$a || (this.$a = t$('header').flag('header'))).setContent(Imba.static([
					(t0.$$a = t0.$$a || t$('h1')).setText(("todos " + this._counter)).end(),
					(t0.$$b = t0.$$b || t$('input').flag('new-todo').setType('text').setPlaceholder('What needs to be done?').setAutofocus(true)).end()
				],1)).end(),
				
				(all.length > 0) && (Imba.static([
					(t0 = self.$b || (self.$b = t$('section').flag('main'))).setContent(Imba.static([
						(t0.$$a = t0.$$a || t$('input').flag('toggle-all').setType('checkbox').setHandler('change','toggleAll')).end(),
						(t1 = t0.$$b || (t0.$$b = t$('ul').flag('todo-list'))).setContent(Imba.static([(function(t1) {
							for (var i=0, ary=iter$(items), len=ary.length, todo, res=[]; i < len; i++) {
								todo = ary[i];
								res.push((t1['_' + todo.id] = t1['_' + todo.id] || t$('todo')).setObject(todo).end());
							};
							return res;
						})(t1)],1)).end()
					],1)).end(),
					
					(t0 = self.$c || (self.$c = t$('footer').flag('footer'))).setContent(Imba.static([
						(t1 = t0.$$a || (t0.$$a = t$('span').flag('todo-count'))).setContent(Imba.static([
							(t1.$$a = t1.$$a || t$('strong')).setText(("" + (active.length) + " ")).end(),
							active.length == 1 ? ('item left') : ('items left')
						],1)).end(),
						(t1 = t0.$$b || (t0.$$b = t$('ul').flag('filters'))).setContent(Imba.static([
							(t2 = t1.$$a || (t1.$$a = t$('li'))).setContent(Imba.static([(t2.$$a = t2.$$a || t$('a').setHref('#/')).flag('selected',(items == all)).setText('All').end()],1)).end(),
							(t2 = t1.$$b || (t1.$$b = t$('li'))).setContent(Imba.static([(t2.$$a = t2.$$a || t$('a').setHref('#/active')).flag('selected',(items == active)).setText('Active').end()],1)).end(),
							(t2 = t1.$$c || (t1.$$c = t$('li'))).setContent(Imba.static([(t2.$$a = t2.$$a || t$('a').setHref('#/completed')).flag('selected',(items == done)).setText('Completed').end()],1)).end()
						],1)).end(),
						
						(done.length > 0) && (
							(t0.$$c = t0.$$c || t$('button').flag('clear-completed').setHandler('tap','clearCompleted')).setText('Clear completed').end()
						)
					],1)).end()
				],2))
			],1)).synced();
		};
	});
	
	// create an instance of the app (with id app)
	var app = ti$('app','app').end();
	
	// append it to the dom
	q$$('.todoapp').append(app);
	
	// stuff for benchmarking
	window.renderAlways = false;
	
	// now make things accessible for benchmark
	window.todosRenderer = function (){
		return function() { return app.render(); };
	};
	
	window.todosModel = function (){
		return Todos;
	};

})()