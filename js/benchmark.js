(function(){
	
	// externs;
	
	function bench(name,times,blk){
		console.group(name);
		console.time('time');
		var i = 0;
		var start = new Date();
		
		while ((i++) < times){
			blk();
		};
		
		var end = new Date();
		var time = (end - start) / 1000;
		
		console.timeEnd('time');
		console.log(("" + ((times / time).toFixed(2)) + " ops/sec"));
		return console.groupEnd(name);
	};
	
	
	
	BENCH = function(times) {
		
		if(times === undefined) times = 1000;
		var render = window.todosRenderer();
		var model = window.todosModel();
		// clear and add 10 tasks initially
		model.clearAll(); // clear
		for (var len=10, i = 0; i <= len; i++) {
			model.addTodo(("Todo " + i));
		};
		
		// render a few times before starting
		for (var len=1000, i1 = 0; i1 <= len; i1++) {
			render();
		}; // warm up
		
		renderAlways = false;
		bench("with extra logic in shouldComponentUpdate",times,function() {
			return render();
		});
		
		renderAlways = true;
		bench("full rerender of whole app",times,function() {
			return render();
		});
		
		// we want to do this without informing about any changes,
		// and without persisting. So we do it manually
		var items = model._items || model.todos;
		
		bench("moving item from top to bottom",times,function() {
			items.push(items.shift()); // move item from top to bottom9
			return render(); // render manually
		});
		
		return;
	};

})()