from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course, UserInterest
from .serializers import CourseSerializer, RecommendationRequestSerializer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

@api_view(['POST'])
def get_recommendations(request):
    serializer = RecommendationRequestSerializer(data=request.data)
    if serializer.is_valid():
        user_interests = serializer.validated_data['interests']
        
        # Save user interest
        UserInterest.objects.create(interests=user_interests)
        
        # Get all courses
        courses = Course.objects.all()
        if not courses:
            return Response({'error': 'No courses available'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create course content for similarity matching
        course_data = []
        for course in courses:
            content = f"{course.title} {course.category} {course.sub_category} {course.skills}"
            course_data.append({
                'id': course.id,
                'content': content,
                'course': course
            })
        
        # TF-IDF Vectorization
        vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        course_contents = [item['content'] for item in course_data]
        course_contents.append(user_interests)
        
        tfidf_matrix = vectorizer.fit_transform(course_contents)
        
        # Calculate similarity
        user_vector = tfidf_matrix[-1]
        course_vectors = tfidf_matrix[:-1]
        similarities = cosine_similarity(user_vector, course_vectors).flatten()
        
        # Get top 5 recommendations
        top_indices = similarities.argsort()[-5:][::-1]
        recommended_courses = []
        
        for idx in top_indices:
            if similarities[idx] > 0:
                course = course_data[idx]['course']
                recommended_courses.append({
                    'id': course.id,
                    'title': course.title,
                    'category': course.category,
                    'rating': course.rating,
                    'url': course.url,
                    'short_intro': course.short_intro,
                    'similarity_score': float(similarities[idx])
                })
        
        return Response({'recommendations': recommended_courses})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_all_courses(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)