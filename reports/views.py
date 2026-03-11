from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from datetime import date
from income.models import Income
from expenses.models import Expense
from savings.models import SavingsGoal
import json

@login_required
def reports_view(request):
    user = request.user
    today = date.today()

    selected_year = int(request.GET.get('year', today.year))
    selected_month = int(request.GET.get('month', 0))  # 0 = all months

    # --- Monthly Income vs Expenses (all 12 months for selected year) ---
    monthly_labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    monthly_income_data = []
    monthly_expense_data = []

    for month in range(1, 13):
        inc = Income.objects.filter(user=user, date__year=selected_year, date__month=month).aggregate(Sum('amount'))['amount__sum'] or 0
        exp = Expense.objects.filter(user=user, date__year=selected_year, date__month=month).aggregate(Sum('amount'))['amount__sum'] or 0
        monthly_income_data.append(float(inc))
        monthly_expense_data.append(float(exp))

    # --- Expense by Category ---
    expense_filter = {'user': user, 'date__year': selected_year}
    if selected_month:
        expense_filter['date__month'] = selected_month

    expenses_by_cat = Expense.objects.filter(**expense_filter).values('category').annotate(total=Sum('amount'))
    cat_labels = [e['category'].title() for e in expenses_by_cat]
    cat_amounts = [float(e['total']) for e in expenses_by_cat]

    # --- Summary Stats ---
    income_filter = {'user': user, 'date__year': selected_year}
    if selected_month:
        income_filter['date__month'] = selected_month

    total_income = Income.objects.filter(**income_filter).aggregate(Sum('amount'))['amount__sum'] or 0
    total_expenses = Expense.objects.filter(**expense_filter).aggregate(Sum('amount'))['amount__sum'] or 0
    net_balance = total_income - total_expenses

    # --- Savings Goals ---
    savings_goals = SavingsGoal.objects.filter(user=user)

    # --- Recent Transactions ---
    recent_income = Income.objects.filter(**income_filter).order_by('-date')[:5]
    recent_expenses = Expense.objects.filter(**expense_filter).order_by('-date')[:5]

    years = list(range(2020, today.year + 2))

    context = {
        'monthly_labels': json.dumps(monthly_labels),
        'monthly_income_data': json.dumps(monthly_income_data),
        'monthly_expense_data': json.dumps(monthly_expense_data),
        'cat_labels': json.dumps(cat_labels),
        'cat_amounts': json.dumps(cat_amounts),
        'total_income': total_income,
        'total_expenses': total_expenses,
        'net_balance': net_balance,
        'savings_goals': savings_goals,
        'recent_income': recent_income,
        'recent_expenses': recent_expenses,
        'selected_year': selected_year,
        'selected_month': selected_month,
        'years': years,
        'months': [
            (0,'All Months'),(1,'January'),(2,'February'),(3,'March'),
            (4,'April'),(5,'May'),(6,'June'),(7,'July'),
            (8,'August'),(9,'September'),(10,'October'),(11,'November'),(12,'December'),
        ],
    }
    return render(request, 'reports/reports.html', context)