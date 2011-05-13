SimulchartRails::Application.routes.draw do
  resources :charts do
    member do
      get :embed
    end
  end

  match '/twitter' => redirect("http://twitter.com/simulchart")
  match '/mat'     => redirect("http://matschaffer.com")
  match '/trotter' => redirect("http://www.trottercashion.com")
  match '/steve'   => redirect("http://www.thoughtmerchants.com")

  match '/gist/bieber' => redirect("http://gist.github.com/556411#file_bieber.js")
  match '/gist/load'   => redirect("http://gist.github.com/556411#file_load.sh")

  match '/demos' => 'home#demos'

  root :to => 'home#index'
end
