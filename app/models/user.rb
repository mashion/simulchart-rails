class User < ActiveRecord::Base
  has_many :charts

  def self.find_or_create_from_omniauth(auth)
    case auth['provider']
    when 'twitter'
      User.find_or_create_by_twitter_id(auth['uid'])
    else
      raise "Do not know how to auth with '#{auth['provider']}' provider"
    end
  end
end
