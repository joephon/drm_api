import json
import xlsxwriter
from pprint import pprint

data = json.load(open('static/cache.json'))
workbook = xlsxwriter.Workbook('static/cache.xlsx')

_captions = data['_captions']
_data = data['_data']
_all = [_captions] + _data

worksheet = workbook.add_worksheet()

row_index = 0
for row in _all:
    col_index = 0
    for col in row:
        worksheet.write(row_index, col_index, col)
        col_index += 1
    row_index += 1

workbook.close()
pprint(len(_all))

# python scripts/samples/xlsx.py  61.47s user 0.92s system 96% cpu 1:04.38 total
