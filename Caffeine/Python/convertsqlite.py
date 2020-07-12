import csv_to_sqlite

options = csv_to_sqlite.CsvOptions(typing_style="full", encoding="utf8")
input_files = ["CSVs/All_drink_info.csv","CSVs/Caffeine_intensity.csv","CSVs/Food.csv","CSVs/Gum.csv","CSVs/Workout Supps.csv"]
csv_to_sqlite.write_csv(input_files,"caffeine.sqlite", options)