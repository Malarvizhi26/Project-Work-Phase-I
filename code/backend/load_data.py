import os
import django
import pandas as pd

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recommender_system.settings')
django.setup()

from courses.models import Course

def load_courses_from_csv(csv_path):
    df = pd.read_csv(csv_path)
    
    for _, row in df.iterrows():
        try:
            rating = None
            if pd.notna(row.get('Rating')):
                rating_str = str(row['Rating']).replace('stars', '').strip()
                try:
                    rating = float(rating_str)
                except:
                    rating = None
            
            Course.objects.get_or_create(
                title=row.get('Title', ''),
                defaults={
                    'url': row.get('URL', ''),
                    'short_intro': row.get('Short Intro', ''),
                    'category': row.get('Category', ''),
                    'sub_category': row.get('Sub-Category', ''),
                    'course_type': row.get('Course Type', ''),
                    'language': row.get('Language', ''),
                    'skills': row.get('Skills', ''),
                    'instructors': row.get('Instructors', ''),
                    'rating': rating,
                    'number_of_viewers': str(row.get('Number of viewers', '')),
                    'duration': row.get('Duration', ''),
                    'site': row.get('Site', ''),
                    'level': row.get('Level', ''),
                }
            )
        except Exception as e:
            print(f"Error loading course: {e}")
    
    print(f"Loaded {Course.objects.count()} courses")

if __name__ == '__main__':
    csv_path = input("Enter CSV file path: ")
    load_courses_from_csv(csv_path)