from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from income.models import Income
from expenses.models import Expense
from savings.models import SavingsGoal
from django.db.models import Sum
from datetime import datetime

@login_required
def dashboard_view(request):
    # If user is staff/admin, redirect to admin dashboard
    if request.user.is_staff:
        return redirect('admin_dashboard')
    
    # Regular user dashboard logic
    user = request.user
    today = datetime.today()
    
    # Get totals
    total_income = Income.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
    total_expenses = Expense.objects.filter(user=user).aggregate(Sum('amount'))['amount__sum'] or 0
    balance = total_income - total_expenses
    
    # Monthly
    monthly_income = Income.objects.filter(
        user=user, 
        date__month=today.month,
        date__year=today.year
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    monthly_expenses = Expense.objects.filter(
        user=user,
        date__month=today.month,
        date__year=today.year
    ).aggregate(Sum('amount'))['amount__sum'] or 0
    
    # Recent transactions
    recent_income = Income.objects.filter(user=user).order_by('-date')[:5]
    recent_expenses = Expense.objects.filter(user=user).order_by('-date')[:5]
    
    # Savings goals
    savings_goals = SavingsGoal.objects.filter(user=user)
    
    # Expense categories for chart
    expenses_by_cat = Expense.objects.filter(
        user=user,
        date__month=today.month,
        date__year=today.year
    ).values('category').annotate(total=Sum('amount'))
    
    expense_categories = [e['category'].title() for e in expenses_by_cat]
    expense_amounts = [float(e['total']) for e in expenses_by_cat]
    
    context = {
        'total_income': total_income,
        'total_expenses': total_expenses,
        'balance': balance,
        'monthly_income': monthly_income,
        'monthly_expenses': monthly_expenses,
        'recent_income': recent_income,
        'recent_expenses': recent_expenses,
        'savings_goals': savings_goals,
        'expense_categories': expense_categories,
        'expense_amounts': expense_amounts,
    }
    return render(request, 'dashboard/dashboard.html', context)