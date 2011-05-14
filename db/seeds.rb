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
             points:  [{x: 1, y: 1},
                       {x: 2, y: 2},
                       {x: 3, y: 13},
                       {x: 4, y: 4},
                       {x: 5, y: 5},
                       {x: 6, y: 6},
                       {x: 7, y: 20},
                       {x: 8, y: 4},
                       {x: 9, y: 3}])

