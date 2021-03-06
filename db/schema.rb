# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110529134326) do

  create_table "charts", :force => true do |t|
    t.string   "name"
    t.string   "x_label"
    t.string   "y_label"
    t.integer  "user_id"
    t.text     "points"
    t.string   "update_key"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "charts", ["update_key"], :name => "index_charts_on_update_key"
  add_index "charts", ["user_id"], :name => "index_charts_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "twitter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["twitter_id"], :name => "index_users_on_twitter_id"

end
