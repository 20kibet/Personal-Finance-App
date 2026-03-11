from django.shortcuts import render, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.models import User
from django.db import models
from income.models import Income
from expenses.models import Expense
from budgets.models import Budget
from savings.models import SavingsGoal
from django.db.models import Sum, Count, F
from datetime import timedelta
from django.utils import timezone

@staff_member_required(login_url='/accounts/login/')
def admin_dashboard(request):
    # User stats
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    new_users_today = User.objects.filter(date_joined__date=timezone.now().date()).count()

    # Financial stats across all users
    total_income = Income.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    total_expenses = Expense.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    platform_balance = total_income - total_expenses

    # Budget stats
    total_budgets = Budget.objects.count()
    active_budgets = Budget.objects.filter(
        month=timezone.now().month,
        year=timezone.now().year
    ).count()

    # Savings goals
    total_goals = SavingsGoal.objects.count()
    completed_goals = SavingsGoal.objects.filter(
        current_amount__gte=F('target_amount')
    ).count()

    # Recent users
    recent_users = User.objects.order_by('-date_joined')[:5]

    # Top users by activity
    top_users = User.objects.annotate(
        income_count=Count('income'),
        expense_count=Count('expense'),
        total_transactions=Count('income') + Count('expense')
    ).order_by('-total_transactions')[:5]

    # Monthly signups chart data
    last_6_months = []
    signup_counts = []

    for i in range(5, -1, -1):
        month = timezone.now() - timedelta(days=30 * i)
        month_start = month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if i > 0:
            month_end = (month_start + timedelta(days=32)).replace(day=1)
        else:
            month_end = timezone.now()
        count = User.objects.filter(
            date_joined__range=[month_start, month_end]
        ).count()
        last_6_months.append(month_start.strftime('%b %Y'))
        signup_counts.append(count)

    context = {
        'total_users': total_users,
        'active_users': active_users,
        'new_users_today': new_users_today,
        'total_income': total_income,
        'total_expenses': total_expenses,
        'platform_balance': platform_balance,
        'total_budgets': total_budgets,
        'active_budgets': active_budgets,
        'total_goals': total_goals,
        'completed_goals': completed_goals,
        'recent_users': recent_users,
        'top_users': top_users,
        'signup_months': last_6_months,
        'signup_counts': signup_counts,
    }
    return render(request, 'admin_dashboard/dashboard.html', context)


@staff_member_required(login_url='/accounts/login/')
def user_detail(request, user_id):
    user = get_object_or_404(User, pk=user_id)

    income_total = Income.objects.filter(user=user).aggregate(
        Sum('amount'))['amount__sum'] or 0
    expense_total = Expense.objects.filter(user=user).aggregate(
        Sum('amount'))['amount__sum'] or 0
    balance = income_total - expense_total

    recent_income = Income.objects.filter(user=user).order_by('-date')[:5]
    recent_expenses = Expense.objects.filter(user=user).order_by('-date')[:5]
    budgets = Budget.objects.filter(user=user)
    goals = SavingsGoal.objects.filter(user=user)

    context = {
        'viewed_user': user,
        'income_total': income_total,
        'expense_total': expense_total,
        'balance': balance,
        'recent_income': recent_income,
        'recent_expenses': recent_expenses,
        'budgets': budgets,
        'goals': goals,
    }
    return render(request, 'admin_dashboard/user_detail.html', context)