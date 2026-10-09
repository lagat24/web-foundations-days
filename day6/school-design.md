# School Database Design

## 1. Tables

### Students

The `students` table stores student information. Each student has a unique `student_id`, a name and an email address. The ID is the primary key, and the email is required and unique.

### Courses

The `courses` table stores information about available courses. Each course has a unique `course_id`, a course name and an instructor. The ID is the primary key.

### Enrolments

The `enrolments` table records which students take which courses. It contains an `enrolment_id` as its primary key, `student_id` and `course_id` as foreign keys, and a grade for the student in that course. A unique constraint on `student_id` and `course_id` prevents duplicate enrolments.

## 2. Relationships

### One-to-many

A student can have many enrolments, but each enrolment belongs to one student. Therefore, the relationship between students and enrolments is one-to-many.

A course can also have many enrolments, but each enrolment refers to one course. Therefore, the relationship between courses and enrolments is one-to-many.

### Many-to-many

Students and courses have a many-to-many relationship. One student can take several courses, and one course can have several students.

The `enrolments` table is necessary as a join table to represent this relationship. It connects each student to each course and stores additional information about the relationship, such as the student's grade.

## 3. Index

I would add an index on `enrolments(course_id)` to speed up queries that find students enrolled in a particular course and queries that group enrolments by course. This can improve performance as the database grows.

## 4. SQL or NoSQL?

I would choose SQL for this school system because the data is structured and has clear relationships between students, courses and enrolments. A relational database supports primary keys, foreign keys and unique constraints to maintain data integrity. SQL joins also make it straightforward to retrieve course lists, student lists and enrolment counts. NoSQL could be suitable for more flexible or rapidly changing data structures, but a relational database is a better fit for these requirements.
