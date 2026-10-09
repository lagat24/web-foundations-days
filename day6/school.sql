PRAGMA foreign_keys = ON;

-- 1. Create tables

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    instructor TEXT NOT NULL
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);

-- 2. Insert sample students

INSERT INTO students (student_id, name, email) VALUES
(1, 'Alice Kamau', 'alice@example.com'),
(2, 'Brian Otieno', 'brian@example.com'),
(3, 'Carol Wanjiku', 'carol@example.com');

-- Insert sample courses

INSERT INTO courses (course_id, course_name, instructor) VALUES
(1, 'Database Systems', 'Mr. Mwangi'),
(2, 'Web Development', 'Ms. Achieng'),
(3, 'Programming Fundamentals', 'Mr. Hassan');

-- Insert sample enrolments

INSERT INTO enrolments
    (enrolment_id, student_id, course_id, grade)
VALUES
(1, 1, 1, 'A'),
(2, 1, 2, 'B'),
(3, 2, 1, 'B'),
(4, 2, 3, 'A'),
(5, 3, 2, 'A');

-- 3. Query: All courses for one student by name

SELECT
    students.name AS student_name,
    courses.course_name,
    enrolments.grade
FROM students
JOIN enrolments
    ON students.student_id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE students.name = 'Alice Kamau';

-- 4. Query: All students enrolled on one course

SELECT
    students.name AS student_name,
    courses.course_name
FROM students
JOIN enrolments
    ON students.student_id = enrolments.student_id
JOIN courses
    ON enrolments.course_id = courses.course_id
WHERE courses.course_name = 'Database Systems';

-- 5. Query: Number of students per course, including courses with zero students

SELECT
    courses.course_name,
    COUNT(enrolments.student_id) AS student_count
FROM courses
LEFT JOIN enrolments
    ON courses.course_id = enrolments.course_id
GROUP BY courses.course_id, courses.course_name;

-- 6. Query: Students who have no enrolments

SELECT
    students.student_id,
    students.name
FROM students
LEFT JOIN enrolments
    ON students.student_id = enrolments.student_id
WHERE enrolments.enrolment_id IS NULL;

-- 7. Update one enrolment's grade

UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 2;

-- Check the updated grade

SELECT *
FROM enrolments
WHERE enrolment_id = 2;

-- 8. Index to speed up searches for enrolments by course

CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
