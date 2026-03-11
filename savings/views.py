from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import SavingsGoal
from .forms import SavingsGoalForm

@login_required
def savings_list(request):
    goals = SavingsGoal.objects.filter(user=request.user)
    return render(request, 'savings/savings_list.html', {'goals': goals})

@login_required
def savings_add(request):
    if request.method == 'POST':
        form = SavingsGoalForm(request.POST)
        if form.is_valid():
            goal = form.save(commit=False)
            goal.user = request.user
            goal.save()
            messages.success(request, 'Savings goal added!')
            return redirect('savings_list')
    else:
        form = SavingsGoalForm()
    return render(request, 'savings/savings_form.html', {'form': form, 'title': 'Add Savings Goal'})

@login_required
def savings_edit(request, pk):
    goal = get_object_or_404(SavingsGoal, pk=pk, user=request.user)
    if request.method == 'POST':
        form = SavingsGoalForm(request.POST, instance=goal)
        if form.is_valid():
            form.save()
            messages.success(request, 'Savings goal updated!')
            return redirect('savings_list')
    else:
        form = SavingsGoalForm(instance=goal)
    return render(request, 'savings/savings_form.html', {'form': form, 'title': 'Edit Savings Goal'})

@login_required
def savings_delete(request, pk):
    goal = get_object_or_404(SavingsGoal, pk=pk, user=request.user)
    if request.method == 'POST':
        goal.delete()
        messages.success(request, 'Savings goal deleted!')
        return redirect('savings_list')
    return render(request, 'savings/savings_confirm_delete.html', {'goal': goal})
