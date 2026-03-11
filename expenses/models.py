from django.db import models
from django.contrib.auth.models import User

EXPENSE_CATEGORIES = [
    ('food', 'Food & Dining'),
    ('transport', 'Transport'),
    ('rent', 'Rent & Housing'),
    ('utilities', 'Utilities'),
    ('entertainment', 'Entertainment'),
    ('health', 'Health & Medical'),
    ('education', 'Education'),
    ('shopping', 'Shopping'),
    ('other', 'Other'),
]

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=EXPENSE_CATEGORIES)
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.title} - {self.amount}"
