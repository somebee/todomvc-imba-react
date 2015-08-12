extern renderAlways

var ESCAPE_KEY = 27
var ENTER_KEY = 13

# this way of caching is not the 'Imba way' - it is merely a very simple way
# to do something similar to React 'shouldComponentUpdate'. You can implement
# this however you want - you merely try to figure out whether anything have
# changed inside tag#commit, and then rerender if it has.
tag todo < li

	def model
		up(%app).model

	# commit is always called when a node is rendered as part of an outer tree
	# this is where we decide whether to cascade the render through to inner
	# parts of this.

	def commit
		# improvised alternative to React shouldComponentUpdate
		# you can do this however you want. In Imba there is really no reason
		# not to render (since it is so fast) - but to make it behave like
		# the react version we only render the content if we know it has changed
		render if renderAlways or @hash != hash(object)

	def hash o
		"" + o:title + o:completed + @editing

	def render
		var todo = @object
		@hash = hash(todo)

		<self .completed=(object:completed) .editing=(@editing) >
			<div.view>
				<label :dblclick='edit'> object:title
				<input.toggle type='checkbox' :tap='toggle' checked=(object:completed)>
				<button.destroy :tap='drop'>
			<input[object]@input.edit type='text'>

	def edit
		@editing = yes
		@input.value = object:title
		setTimeout(&,10) do @input.focus
		render # only need to render this

	def drop
		model.destroy(object)

	def toggle
		model.toggle(object)

	def submit
		@editing = no
		var title = @input.value.trim
		title ? model.rename(object,title) : modal.destroy(object)

	def onfocusout e
		submit if @editing

	def cancel
		@editing = no
		@input.blur
		render

	# onkeydown from inner element cascade through
	def onkeydown e
		e.halt
		submit if e.which == ENTER_KEY
		cancel if e.which == ESCAPE_KEY

