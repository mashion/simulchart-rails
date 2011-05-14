class HomeController < ApplicationController
  def index
    @charts = []
    @bieber = Chart.first
  end

  def demos
    @load = Chart.first
    @everyone = Chart.first
  end
end
