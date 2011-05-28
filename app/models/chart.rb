class Chart < ActiveRecord::Base
  belongs_to :user
  before_create :create_update_key

  def points=(vals)
    # We're only keeping the last 30
    write_attribute(:points, vals.last(30).to_json)
  end

  def points
    JSON.parse(read_attribute(:points))
  rescue
    []
  end

  def create_update_key
    return unless update_key.blank?
    self.update_key = ActiveSupport::SecureRandom.hex(16)
  end
end
