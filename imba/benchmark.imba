
extern window, renderAlways

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
	console.log "{(times / time).toFixed(2)} ops/sec"
	console.groupEnd(name)



BENCH = do |times = 1000|

	var render = window.todosRenderer
	var model = window.todosModel
	# clear and add 10 tasks initially
	model.clearAll # clear
	model.addTodo("Todo {i}") for i in [0..10]

	# render a few times before starting
	render() for i in [0..1000] # warm up

	renderAlways = no
	bench("with extra logic in shouldComponentUpdate", times) do
		render()

	renderAlways = yes
	bench("full rerender of whole app", times) do
		render()

	# we want to do this without informing about any changes,
	# and without persisting. So we do it manually
	var items = model.@items or model:todos

	bench("moving item from top to bottom", times) do
		items.push( items.shift ) # move item from top to bottom9
		render() # render manually

	return