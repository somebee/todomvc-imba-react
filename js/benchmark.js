(function(){
	
	// externs;
	
	function part(name,times,blk){
		console.group(name);
		console.time('time');
		var start = new Date();
		blk();
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
		for (var len=100, i1 = 0; i1 <= len; i1++) {
			render();
		};
		
		renderAlways = false;
		part("with extra logic in shouldComponentUpdate",times,function() {
			for (var len=times, i2 = 0, res=[]; i2 <= len; i2++) {
				res.push(render());
			};
			return res;
		});
		
		renderAlways = true;
		part("full rerender of whole app",times,function() {
			for (var len=times, i2 = 0, res=[]; i2 <= len; i2++) {
				res.push(render());
			};
			return res;
		});
		
		return;
	};

})()