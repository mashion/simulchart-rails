require 'net/http'

class ChartsController < ApplicationController
  before_filter :find_chart, :only => [:show, :embed]
  before_filter :find_chart_by_update_key, :only => [:update, :append_value]

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

  def append_value
    last_x    = @chart.points.last.try(:[], "x") || 0
    new_point = { x: last_x + 1, y: params[:value] }
    @chart.points += [new_point]
    @chart.save
    Net::HTTP.post_form(URI.parse("http://#{Settings["chloe"]["host"]}:#{Settings["chloe"]["port"]}/send"),
                        {channel: @chart.id,
                         data:    new_point.to_json})
    render :text => 'success'
  end

  def find_chart
    @chart = Chart.find(params[:id])
  end
  private :find_chart

  def find_chart_by_update_key
    @chart = Chart.find_by_update_key(params[:id])
  end
  private :find_chart_by_update_key
end
