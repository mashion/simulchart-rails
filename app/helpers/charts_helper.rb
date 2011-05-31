module ChartsHelper
  def chart_embed(chart)
    content_tag :iframe, '', :src => embed_chart_url(chart, :width => 960, :height => 300), :frameBorder => 0
  end

  # Very basic auth stuff. Will want to switch to cancan if
  # we do anything else.
  def owner?
    return unless current_user
    @chart.user_id == current_user.id
  end
end
