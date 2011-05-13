class HomeController < ApplicationController
  def index
    @charts = []
    @bieber = Chart.new
  end
end
