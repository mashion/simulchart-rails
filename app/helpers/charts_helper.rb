module ChartsHelper
  def chart_embed(chart)
    content_tag :iframe, '', :src => embed_chart_url(chart), :frameBorder => 0
  end
end
