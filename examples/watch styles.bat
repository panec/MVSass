@ECHO OFF
call sass --watch core/sass:core/css theme/sass:theme/css -r ./../lib/ruby/parentSelector.rb
