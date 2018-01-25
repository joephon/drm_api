# dl-xlsx-py

### API

```
GET /dl?startTime=&endTime=&number=&token=
```

> 参数：startTime | endTime | number

**HTTPie**

```
http HEAD http://120.24.157.166:5000/dl
```

### Development

**安装环境**

```
pip install pipenv
```

```
pipenv install
pipenv shell
```

**启动服务器**

```
python manage.py runserver
```

### Deployment

> 生产环境的 Python 版本为 3.6.3
```
python3 -V
```

> Python 3.6.3

```
pip install pipenv
```

**指定对应版本环境**

```
pipenv --python 3.6
```

```
pipenv install
pipenv shell
```

```
pm2 start manage.py --name v1.0.1 --interpreter python --no-daemon -- runserver -h 0.0.0.0 -p 4123
```
