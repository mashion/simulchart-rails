class ChartsController < ApplicationController
  before_filter :find_chart, :except => :create

  def create
    redirect_to Chart.create(:points => [])
  end

  def show
    @charts = []
  end

  def update
    @chart.update_attributes(params[:chart])
    redirect_to @chart
  end

  def embed
    render :layout => nil
  end

  def find_chart
    @chart = Chart.find(params[:id])
  end
  private :find_chart
end
