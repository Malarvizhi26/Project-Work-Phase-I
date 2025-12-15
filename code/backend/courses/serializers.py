from rest_framework import serializers
from .models import Course, UserInterest

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class UserInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInterest
        fields = '__all__'

class RecommendationRequestSerializer(serializers.Serializer):
    interests = serializers.CharField(max_length=1000)