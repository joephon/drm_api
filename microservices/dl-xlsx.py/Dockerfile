FROM ubuntu:18.04

RUN sed -i 's#http://archive.ubuntu.com#http://mirrors.163.com#g' /etc/apt/sources.list

RUN apt-get update
# RUN apt-get install -y software-properties-common
# RUN apt-get install -y python-software-properties

# RUN add-apt-repository ppa:deadsnakes/ppa
# RUN apt-get update

RUN mkdir -p /dl-xlsx.py

RUN apt-get install -y mongodb
# RUN apt-get install -y python3.6
RUN apt-get install -y python3-pip
RUN apt-get install -y sqlite3 libmysqlclient-dev

COPY . /dl-xlsx.py
WORKDIR /dl-xlsx.py

RUN pip3 install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

ENV PYTHONIOENCODING=UTF-8
ENV FLASK_ENV=production

EXPOSE 8000

CMD ["gunicorn", "-b", "0.0.0.0:8000", "manager:app"]
