module Sass::Script::Functions
	def parentsSelector()

		def opts(value)
			value.options = options
			value
		end

		selector = environment.selector
		return opts(Sass::Script::Value::Null.new) unless selector
		opts(Sass::Script::Value::List.new(selector.members.map do |seq|
			Sass::Script::Value::List.new(seq.members.map do |component|
				Sass::Script::Value::String.new(component.to_s)
			end, :space)
		end, :comma))
	end
	declare :parentsSelector, []
end
