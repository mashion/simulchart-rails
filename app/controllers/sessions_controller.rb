class SessionsController < ApplicationController
  def create
    #raise request.env["omniauth.auth"].to_yaml
    redirect_to Chart.create(:points => [])
  end
end
