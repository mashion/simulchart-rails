class CreateCharts < ActiveRecord::Migration
  def change
    create_table :charts do |t|
      t.string :name
      t.string :x_label
      t.string :y_label
      t.belongs_to :user
      t.string :points
      t.string :update_key

      t.timestamps
    end
    add_index :charts, :user_id
    add_index :charts, :update_key
  end
end
