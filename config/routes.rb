SimulchartRails::Application.routes.draw do
  match '/twitter' => redirect("http://twitter.com/simulchart")
  match '/mat' => redirect("http://matschaffer.com")
  match '/trotter' => redirect("http://www.trottercashion.com")
  match '/steve' => redirect("http://www.thoughtmerchants.com")

  root :to => 'home#index'
end
