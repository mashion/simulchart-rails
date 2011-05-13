class HomeController < ApplicationController
  def index
    @charts = []
    @bieber = Chart.first
  end

  def demos
    @load = Chart.first
    @everybody = Chart.first
  end
end
