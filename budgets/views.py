from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import date
from .models import Budget
from .forms import BudgetForm
from expenses.models import Expense
from django.db.models import Sum

@login_required
def budget_list(request):
    today = date.today()

    # Allow filtering by month/year via URL params
    month = int(request.GET.get('month', today.month))
    year  = int(request.GET.get('year',  today.year))

    budgets = Budget.objects.filter(user=request.user, month=month, year=year)

    budget_data = []
    for budget in budgets:
        spent = Expense.objects.filter(
            user=request.user,
            category=budget.category,
            date__month=month,
            date__year=year
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        budget_data.append({
            'budget':     budget,
            'spent':      spent,
            'remaining':  budget.amount - spent,
            'percentage': min(int((spent / budget.amount) * 100), 100) if budget.amount > 0 else 0,
        })

    # Month/year selectors for the filter
    years  = list(range(2023, today.year + 2))
    months = [
        (1,'January'),(2,'February'),(3,'March'),(4,'April'),
        (5,'May'),(6,'June'),(7,'July'),(8,'August'),
        (9,'September'),(10,'October'),(11,'November'),(12,'December'),
    ]

    context = {
        'budget_data':     budget_data,
        'selected_month':  month,
        'selected_year':   year,
        'years':           years,
        'months':          months,
    }
    return render(request, 'budgets/budget_list.html', {'budget_data': budget_data, **context})

@login_required
def budget_add(request):
    if request.method == 'POST':
        form = BudgetForm(request.POST)
        if form.is_valid():
            budget = form.save(commit=False)
            budget.user = request.user
            budget.save()
            messages.success(request, 'Budget set successfully!')
            return redirect('budget_list')
    else:
        form = BudgetForm()
    return render(request, 'budgets/budget_form.html', {'form': form, 'title': 'Set Budget'})

@login_required
def budget_delete(request, pk):
    budget = get_object_or_404(Budget, pk=pk, user=request.user)
    if request.method == 'POST':
        budget.delete()
        messages.success(request, 'Budget deleted!')
        return redirect('budget_list')
    return render(request, 'budgets/budget_confirm_delete.html', {'budget': budget})