import os
import json
import arrow
import xlsxwriter
from pprint import pprint

data = json.load(open(os.path.abspath(os.path.dirname(__file__) + '/../data.json'), encoding='utf-8'))
data_keys = data['data_keys']
captions = data['captions']

def generate_xlsx(source):
    workbook = xlsxwriter.Workbook('cache/dl.xlsx')
    worksheet = workbook.add_worksheet(arrow.utcnow().format('YYYY-MM-DD'))

    caption_col_index = 0
    for caption_col in captions:
        worksheet.write(0, caption_col_index, caption_col)
        caption_col_index += 1

    row_index = 1
    for item in source:
        item_number = item['number']
        if item['ts']:
            item_created_at = arrow.get(int(item['ts']) / 1000).format('YYYY-MM-DD HH:mm:ss [SSS]')
        else:
            item_created_at = ' --- '
        item_data = dict(list(map(lambda _: (list(_.keys())[0], list(_.values())[0]), item['data'])))
        item_extra_data = []

        for key in data_keys:
            try:
                item_extra_data.append(item_data[key])
            except KeyError:
                item_extra_data.append(' --- ')
            else:
                pass

        item_row = [item_number, item_created_at] + item_extra_data

        col_index = 0
        for item_col in item_row:
            worksheet.write(row_index, col_index, item_col)
            col_index += 1
        row_index += 1

    workbook.close()
