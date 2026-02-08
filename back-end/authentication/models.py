from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


class User(AbstractUser):
    """
    Custom User model: first_name, last_name như bình thường (AbstractUser).
    Yêu cầu có ít nhất một trong hai: email hoặc phoneNumber.
    """
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    phoneNumber = models.CharField(max_length=20, blank=True, null=True, verbose_name="Số điện thoại")
    
    class Meta:
        verbose_name = "Người dùng"
        verbose_name_plural = "Người dùng"
    
    def clean(self):
        """Validation: Phải có ít nhất một trong hai (email hoặc phoneNumber)"""
        super().clean()
        if not self.email and not self.phoneNumber:
            raise ValidationError("Phải có ít nhất một trong hai: email hoặc số điện thoại")
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Gọi clean() trước khi save
        super().save(*args, **kwargs)
    
    def __str__(self):
        name = f"{self.first_name or ''} {self.last_name or ''}".strip() or self.username
        return f"{self.username} - {name}"
