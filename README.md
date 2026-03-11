# Personal Finance & Budgeting App

## Setup Instructions

### 1. Install dependencies
```
pip install -r requirements.txt
```

### 2. Run migrations
```
python manage.py makemigrations
python manage.py migrate
```

### 3. Create admin user
```
python manage.py createsuperuser
```

### 4. Run the server
```
python manage.py runserver
```

### 5. Open browser
Go to: http://127.0.0.1:8000

## Features
- User Registration & Login
- Income Tracking
- Expense Tracking
- Budget Planning
- Savings Goals
- Dashboard with Charts
- Django Admin Panel (/admin)
