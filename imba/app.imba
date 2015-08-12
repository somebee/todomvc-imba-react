
extern window

var ESCAPE_KEY = 27
var ENTER_KEY = 13

Todos = TodoModel.new('imba-todos')

BENCHS = do |times = 1000, renderer = 'render'|

	# clear and add 10 tasks initially
	Todos.items = [] # clear
	Todos.addTodo("Todo {i}") for i in [0..10]

	console.time("bench")
	

	var app = #app
	var i = times
	while --i > 0
		app[renderer]()
	console.timeEnd("bench")
	return

extend tag htmlelement
	
	# optimization for flags 
	def flag flag, bool
		@flags ||= {}

		if arguments:length == 2
			if @flags[flag] != !!bool
				bool ? @dom:classList.add(flag) : @dom:classList.remove(flag)
				@flags[flag] = !!bool
		elif !@flags[flag]
			@dom:classList.add(flag)
			@flags[flag] = yes

		return self

	def unflag flag
		if @flags and @flags[flag]
			@flags[flag] = no
			@dom:classList.remove(flag)

		return self

tag app

	def hash
		"#/"
		# window:location:hash

	def model
		@model

	def build
		@counter = 0
		@model = Todos
		@model.load
		@model.subscribe do render
		window.addEventListener 'hashchange' do
			render
		render
		self

	def onkeydown e
		return unless e.which == ENTER_KEY

		if let value = e.target.value.trim
			model.addTodo(value)
			e.target.value = ""


	def toggleAll e
		model.toggleAll e.target.checked
	
	# remove all completed todos
	def clearCompleted
		%%(.toggle-all).checked = no
		model.clearCompleted

	# load todos from localstorage
	# this is the method that actually takes care of rendering the whole app
	# Imba has a very efficient way of caching the actual elements.
	# this method can easily be called every frame without any performance
	# degradation at all. 
	#
	# A low-end mbp retina (safari 9.0) can render this example 30000 ops/sec
	# or 500 ops/frame. With this kind of performance there is little
	# need for the added complexity of registering listeners, tracking
	# dependencies, or manually calling render.
	def render
		@counter++
		var all    = model.items
		var active = all.filter do |todo| !todo:completed
		var done   = all.filter do |todo| todo:completed

		var items  = {'#/completed': done, '#/active': active}[hash] or all		

		<self>
			<header.header>
				<h1> "todos {@counter}"
				<input.new-todo type='text' placeholder='What needs to be done?'>

			if all:length > 0
				<section.main>
					<input.toggle-all type='checkbox' :change='toggleAll'>
					<ul.todo-list> for todo in items
						<todo[todo]@{todo:id}>

				<footer.footer>
					<span.todo-count>
						<strong> "{active:length} "
						active:length == 1 ? 'item left' : 'items left'
					<ul.filters>
						<li> <a .selected=(items == all)    href='#/'> 'All'
						<li> <a .selected=(items == active) href='#/active'> 'Active'
						<li> <a .selected=(items == done)   href='#/completed'> 'Completed'

					if done:length > 0
						<button.clear-completed :tap='clearCompleted'> 'Clear completed'

# create an instance of the app (with id app)
var app = <app#app>

window:renderAlways = false

# now make things accessible for benchmark
def window.todosRenderer
	return do app.render

def window.todosModel
	return Todos
	
# append it to the dom
$$(.todoapp).append app

