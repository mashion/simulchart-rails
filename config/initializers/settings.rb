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
      @reload  = !Rails.application.config.cache_classes
      @configs = {}
      files = Dir[dir.join('*.yml')]
      files.each do |f|
        name = File.basename(f).sub(/.yml$/, '')
        load_config(name)
      end
    end

    def load_config(name)
      file = SETTINGS_DIR.join("#{name}.yml")
      return unless file.exist?
      @configs[name] = YAML.load_file(file)[Rails.env]
    end

    def [](key)
      load_config(key) if @reload
      @configs[key]
    end
  end
end
