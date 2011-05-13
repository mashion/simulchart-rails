class ChartsController < ApplicationController
  before_filter :find_chart, :except => :create

  def create
    redirect_to Chart.create
  end

  def show
    @charts = []
  end

  def embed
  end

  def find_chart
    @chart = Chart.find(params[:id])
  end
  private :find_chart
end
