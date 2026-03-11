from django.db import models
from django.contrib.auth.models import User

INCOME_CATEGORIES = [
    ('salary', 'Salary'),
    ('freelance', 'Freelance'),
    ('business', 'Business'),
    ('investment', 'Investment'),
    ('gift', 'Gift'),
    ('other', 'Other'),
]

class Income(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=INCOME_CATEGORIES)
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.title} - {self.amount}"
