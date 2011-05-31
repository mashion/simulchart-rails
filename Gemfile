source 'http://rubygems.org'

gem 'rails', '3.1.0.rc1'
gem 'omniauth'

# Bundle edge Rails instead:
#gem 'rails',     :git => 'git://github.com/rails/rails.git'


# Asset template engines
gem 'sass'
gem 'coffee-script'
gem 'uglifier'

gem 'jquery-rails'

# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'
group :production do
  gem 'pg'
end

group :development do
  gem 'mysql2'
end

group :development, :test do
  gem 'ruby-debug19', :require => 'ruby-debug'
end

group :test do
  # Pretty printed test output
  gem 'turn', :require => false
  gem 'sqlite3'
end
