module ChartsHelper
  def chart_embed(chart)
    content_tag :iframe, '', :src => embed_chart_url(chart, :width => 960, :height => 300), :frameBorder => 0
  end
end
