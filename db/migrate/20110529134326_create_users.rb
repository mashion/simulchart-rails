class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :twitter_id

      t.timestamps
    end

    add_index :users, :twitter_id
  end
end
