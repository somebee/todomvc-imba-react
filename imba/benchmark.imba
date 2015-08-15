

window:bench:innerHTML = "
	<header>
	<button id='benchmarkbtn'> Run benchmark</button>
	<input id='benchmarktimes' value='2005' type='text' placeholder='times'/>
	<span> times </span>
	<input id='benchmarktodos' value='10' type='text' placeholder='todos'/>
	<span> todos </span>
	</header>
	<section id='benchmarklog'></section>
"

var btn = window:benchmarkbtn
var log = window:benchmarklog

btn:onclick = do |e|
	btn:textContent = "running benchmark"
	var times = parseFloat(window:benchmarktimes:value or '1000') or 1000
	var todos = parseFloat(window:benchmarktodos:value or '10') or 10
	setTimeout(&,10) do BENCH(times,todos)


# create 200 tasks
# var tasks = []
# var model = window.todosModel
# model.addTodo("Todo {i}") for i in [1..200]
# tasks = (model.@items or model:todos).slice


def bench name, times, blk
	console.group(name)
	console.time('time')
	var i = 0
	var start = Date.new

	while (i++) < times
		blk(i - 1)

	var end = Date.new
	var time = (end - start)
	var rps = (times / time) * 1000

	console.timeEnd('time')
	console.log "{rps.toFixed(2)} op/sec"
	console.groupEnd(name)
	log:innerHTML += "<b>{name}</b><br>"
	log:innerHTML += "<div>({time.toFixed(2)}ms) - {rps.toFixed(2)} op/sec</div><br>"
	self


BENCH = do |times = 1000, tasks = 10|

	var render = window.todosRenderer
	var model = window.todosModel
	# clear and add 10 tasks initially
	model.clearAll # clear
	model.addTodo("Todo {i}") for i in [1..tasks]

	# render a few times before starting
	render() for i in [0..1000] # warm up

	window:renderAlways = no
	bench("render app {times} times - with shouldComponentUpdate optims", times) do |i|
		render()

	setTimeout(&,0) do

		window:renderAlways = yes
		bench("render app {times} times - including all todos (no optims)", times) do |i|
			render()

		window:renderAlways = no
		# we want to do this without informing about any changes,
		# and without persisting. So we do it manually
		var items = model.items


		bench("moving todo from top to bottom and render {times} times", times) do |i|
			items.push( items.shift ) # move item from top to bottom9
			render() # render manually


		var item = items.pop

		bench("add todo,render,remove todo,render", times) do |i|
			items.push( item ) # move item from top to bottom9
			render() # render manually
			items.pop
			render()

		bench("rename task", times) do |i|
			var todo = model.items[0]
			var title = "Todo renamed {i}"
			todo:_title = todo:title = title
			render()
			# model.save(todo,"Todo renamed {i}")
			# in both react and imba this should trigger a render itself
			# and a localStorage store

		# bench("moving todo from bottom to top and render {times} times", times) do
		# 	items.unshift( items.pop ) # move item from top to bottom9
		# 	render() # render manually

	return