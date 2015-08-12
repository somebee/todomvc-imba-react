(function(){
	
	// externs;
	
	var btn = window.benchmarkbtn;
	var log = window.benchmarklog;
	
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
		console.log(("" + ((times / time).toFixed(2)) + " render/sec"));
		console.groupEnd(name);
		log.innerHTML += ("<b>" + name + "</b><br>");
		log.innerHTML += ("<div>(" + (time.toFixed(3)) + "s) - " + ((times / time).toFixed(2)) + " render/sec</div><br>");
		return this;
	};
	
	
	BENCH = function(times,tasks) {
		
		if(times === undefined) times = 1000;
		if(tasks === undefined) tasks = 10;
		var render = window.todosRenderer();
		var model = window.todosModel();
		// clear and add 10 tasks initially
		model.clearAll(); // clear
		for (var len=tasks, i = 1; i <= len; i++) {
			model.addTodo(("Todo " + i));
		};
		
		// render a few times before starting
		for (var len=1000, i1 = 0; i1 <= len; i1++) {
			render();
		}; // warm up
		
		renderAlways = false;
		bench(("render app " + times + " times - with shouldComponentUpdate optims"),times,function() {
			return render();
		});
		
		setTimeout(function() {
			
			renderAlways = true;
			bench(("render app " + times + " times - including all todos (no optims)"),times,function() {
				return render();
			});
			
			renderAlways = false;
			// we want to do this without informing about any changes,
			// and without persisting. So we do it manually
			var items = model._items || model.todos;
			
			
			return bench(("moving todo from top to bottom and render " + times + " times"),times,function() {
				items.push(items.shift()); // move item from top to bottom9
				return render(); // render manually
			});
			
			// bench("moving todo from bottom to top and render {times} times", times) do
			// 	items.unshift( items.pop ) # move item from top to bottom9
			// 	render() # render manually
		},0);
		
		return;
	};
	
	btn.onclick = function(e) {
		btn.textContent = "running benchmark";
		return setTimeout(function() {
			return BENCH(2005);
		},10);
	};

})()