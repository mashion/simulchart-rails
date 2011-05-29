class HomeController < ApplicationController
  def index
    @charts = current_user ? current_user.charts : []
    @bieber = Chart.first
  end

  def demos
    @load = Chart.first
    @everyone = Chart.first
  end
end
