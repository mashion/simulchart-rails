class SessionsController < ApplicationController
  def new
    redirect_to '/auth/twitter'
  end

  def create
    self.current_user = User.find_or_create_from_omniauth(request.env["omniauth.auth"])
    redirect_to current_user.charts.first || current_user.charts.create(:points => [])
  end

  def destroy
    self.current_user = nil
    redirect_to root_url
  end
end
