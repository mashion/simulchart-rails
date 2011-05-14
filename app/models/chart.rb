class Chart < ActiveRecord::Base
  belongs_to :user

  def points=(vals)
    # We're only keeping the last 30
    write_attribute(:points, vals.last(30).to_json)
  end

  def points
    JSON.parse(read_attribute(:points))
  rescue
    []
  end
end
