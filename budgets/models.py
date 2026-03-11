from django.db import models
from django.contrib.auth.models import User

BUDGET_CATEGORIES = [
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

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=50, choices=BUDGET_CATEGORIES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.IntegerField()
    year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'category', 'month', 'year']
        ordering = ['-year', '-month']

    def __str__(self):
        return f"{self.category} - {self.month}/{self.year}"
