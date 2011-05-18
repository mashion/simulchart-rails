module ChloeHelper
  def chloe_js_url
    port = Settings["chloe"]["port"] ? ":#{Settings["chloe"]["port"]}" : ""
    "http://#{Settings["chloe"]["host"]}#{port}/chloe.js"
  end
end
