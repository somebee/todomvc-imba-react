
extern window, document, renderAlways

var btn = window:benchmarkbtn
var log = window:benchmarklog

def bench name, times, blk
	console.group(name)
	console.time('time')
	var i = 0
	var start = Date.new

	while (i++) < times
		blk()

	var end = Date.new
	var time = (end - start) / 1000

	console.timeEnd('time')
	console.log "{(times / time).toFixed(2)} render/sec"
	console.groupEnd(name)
	log:innerHTML += "<b>{name}</b><br>"
	log:innerHTML += "<div>({time.toFixed(3)}s) - {(times / time).toFixed(2)} render/sec</div><br>"
	self


BENCH = do |times = 1000, tasks = 10|

	var render = window.todosRenderer
	var model = window.todosModel
	# clear and add 10 tasks initially
	model.clearAll # clear
	model.addTodo("Todo {i}") for i in [1..tasks]

	# render a few times before starting
	render() for i in [0..1000] # warm up

	renderAlways = no
	bench("render app {times} times - with shouldComponentUpdate optims", times) do
		render()

	setTimeout(&,0) do

		renderAlways = yes
		bench("render app {times} times - including all todos (no optims)", times) do
			render()

		renderAlways = no
		# we want to do this without informing about any changes,
		# and without persisting. So we do it manually
		var items = model.@items or model:todos


		bench("moving todo from top to bottom and render {times} times", times) do
			items.push( items.shift ) # move item from top to bottom9
			render() # render manually

		# bench("moving todo from bottom to top and render {times} times", times) do
		# 	items.unshift( items.pop ) # move item from top to bottom9
		# 	render() # render manually

	return

btn:onclick = do |e|
	btn:textContent = "running benchmark"
	setTimeout(&,10) do BENCH(2005)
