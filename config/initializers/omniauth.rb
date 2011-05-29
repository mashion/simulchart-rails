Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, Settings["twitter"]["key"], Settings["twitter"]["secret"]
end
