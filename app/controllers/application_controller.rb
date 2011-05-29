class ApplicationController < ActionController::Base
  protect_from_forgery

  def current_user=(user)
    session[:user_id] = user.try(:id)
  end

  def current_user
    User.find_by_id(session[:user_id])
  end
  helper_method :current_user
end
