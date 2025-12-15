from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=500)
    url = models.URLField()
    short_intro = models.TextField()
    category = models.CharField(max_length=100)
    sub_category = models.CharField(max_length=100)
    course_type = models.CharField(max_length=50)
    language = models.CharField(max_length=50)
    skills = models.TextField()
    instructors = models.TextField()
    rating = models.FloatField(null=True, blank=True)
    number_of_viewers = models.CharField(max_length=50)
    duration = models.CharField(max_length=100)
    site = models.CharField(max_length=50)
    level = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return self.title

class UserInterest(models.Model):
    interests = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Interest: {self.interests[:50]}"