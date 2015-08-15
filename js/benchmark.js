(function(){
	
	// externs;
	
	
	window.bench.innerHTML = "	<header>	<button id='benchmarkbtn'> Run benchmark</button>	<input id='benchmarktimes' value='2005' type='text' placeholder='times'/>	<span> times </span>	<input id='benchmarktodos' value='10' type='text' placeholder='todos'/>	<span> todos </span>	</header>	<section id='benchmarklog'></section>";
	
	var btn = window.benchmarkbtn;
	var log = window.benchmarklog;
	
	btn.onclick = function(e) {
		btn.textContent = "running benchmark";
		var times = parseFloat(window.benchmarktimes.value || '1000') || 1000;
		var todos = parseFloat(window.benchmarktodos.value || '10') || 10;
		return setTimeout(function() { return BENCH(times,todos); },10);
	};
	
	
	// create 200 tasks
	// var tasks = []
	// var model = window.todosModel
	// model.addTodo("Todo {i}") for i in [1..200]
	// tasks = (model.@items or model:todos).slice
	
	
	function bench(name,times,blk){
		console.group(name);
		console.time('time');
		var i = 0;
		var start = new Date();
		
		while ((i++) < times){
			blk(i - 1);
		};
		
		var end = new Date();
		var time = (end - start);
		var rps = (times / time) * 1000;
		
		console.timeEnd('time');
		console.log(("" + (rps.toFixed(2)) + " op/sec"));
		console.groupEnd(name);
		log.innerHTML += ("<b>" + name + "</b><br>");
		log.innerHTML += ("<div>(" + (time.toFixed(2)) + "ms) - " + (rps.toFixed(2)) + " op/sec</div><br>");
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
		bench(("render app " + times + " times - with shouldComponentUpdate optims"),times,function(i) {
			return render();
		});
		
		setTimeout(function() {
			
			renderAlways = true;
			bench(("render app " + times + " times - including all todos (no optims)"),times,function(i) {
				return render();
			});
			
			renderAlways = false;
			// we want to do this without informing about any changes,
			// and without persisting. So we do it manually
			var items = model.items();
			
			
			bench(("moving todo from top to bottom and render " + times + " times"),times,function(i) {
				items.push(items.shift()); // move item from top to bottom9
				return render(); // render manually
			});
			
			
			var item = items.pop();
			
			bench("add todo,render,remove todo,render",times,function(i) {
				items.push(item); // move item from top to bottom9
				render(); // render manually
				items.pop();
				return render();
			});
			
			return bench("rename task",times,function(i) {
				var todo = model.items()[0];
				return model.save(todo,("Todo renamed " + i));
				// in both react and imba this should trigger a render itself
			});
			
			// bench("moving todo from bottom to top and render {times} times", times) do
			// 	items.unshift( items.pop ) # move item from top to bottom9
			// 	render() # render manually
		},0);
		
		return;
	};

})()