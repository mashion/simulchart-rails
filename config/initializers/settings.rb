module Settings
  SETTINGS_DIR = Rails.root.join('config', 'settings')

  def self.method_missing(meth, *args, &block)
    singleton.send(meth, *args, &block)
  end

  def self.singleton
    @singleton ||= Configs.new(SETTINGS_DIR)
  end

  class Configs
    def initialize(dir)
      @configs = {}
      files = Dir[dir.join('*.yml')]
      files.each do |f|
        name = File.basename(f).sub(/.yml$/, '')
        @configs[name] = YAML.load_file(f)[Rails.env]
      end
    end

    def [](key)
      @configs[key]
    end
  end
end
