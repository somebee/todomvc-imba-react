
extern window, renderAlways

def part name, times, blk
	console.group(name)
	console.time('time')
	var start = Date.new
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
	render() for i in [0..100]

	renderAlways = no
	part("with extra logic in shouldComponentUpdate", times) do
		render() for i in [0..times]

	renderAlways = yes
	part("full rerender of whole app", times) do
		render() for i in [0..times]

	return