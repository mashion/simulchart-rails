# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Daley', city: cities.first)
Chart.create(name:    "From DB Seeds",
             x_label: "time",
             y_label: "awesome",
             points:  "1,2,3,4,5,6,20,4,3")

