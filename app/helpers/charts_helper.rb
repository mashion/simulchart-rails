module ChartsHelper
  def chart_embed(chart)
    # TODO: switch to real chart once we have one
    content_tag :iframe, :src => embed_chart_path(chart), :frameBorder => 0
  end
end
