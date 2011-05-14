class Chart < ActiveRecord::Base
  belongs_to :user

  def points=(vals)
    write_attribute(:points, vals.to_json)
  end

  def points
    JSON.parse(read_attribute(:points))
  end
end
