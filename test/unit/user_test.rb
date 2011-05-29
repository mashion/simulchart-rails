require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "create_with_omniauth using twitter" do
    auth = { 'provider' => 'twitter', 'uid' => '123456' }
    user = User.find_or_create_from_omniauth(auth)
    refute user.new_record?
    assert_equal auth['uid'], user.twitter_id

    same_user = User.find_or_create_from_omniauth(auth)
    assert_equal user, same_user
  end

end
