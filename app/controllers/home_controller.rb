class HomeController < ApplicationController
  def index
    @charts = []
    @bieber = Chart.new
  end

  def demos
    @load = Chart.new
    @everybody = Chart.new
  end
end
