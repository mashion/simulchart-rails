class HomeController < ApplicationController
  def index
    @charts = current_user ? current_user.charts : []
    @bieber = Chart.order('created_at').first
  end

  def demos
    @load = Chart.first
    @everyone = Chart.order('created_at').first
  end
end
