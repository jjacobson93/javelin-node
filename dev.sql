-- Insert the admin account

WITH new_person AS (
    INSERT INTO people (last_name, first_name, updated_at, created_at)
        SELECT 'Test', 'Admin', NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM people WHERE last_name = 'Test' AND first_name = 'Admin'
        )
    RETURNING id AS person_id
), new_user AS (
    INSERT INTO auth_users (person_id, username, password, active, updated_at, created_at)
        SELECT person_id, 'admin@javelinwebapp.com', '$2a$13$wUBEmipbBBExE6ftg67IvOV8yqgID.8GwTa8pm4P0WCL6NeeoeIvS', 't', NOW(), NOW()
        FROM new_person
        WHERE NOT EXISTS (
            SELECT 1 FROM auth_users WHERE username = 'admin@javelinwebapp.com'
        )
    RETURNING person_id, id AS user_id
)

INSERT INTO auth_role_assignment (auth_user_id, auth_role_id, created_at, updated_at)
    SELECT new_user.user_id, (SELECT auth_roles.id FROM auth_roles WHERE auth_roles.name = 'admin'), NOW(), NOW()
    FROM new_user
    WHERE NOT EXISTS (
        SELECT 1 FROM auth_role_assignment
        JOIN auth_users ON auth_users.id = auth_role_assignment.auth_user_id AND auth_users.username = 'admin@javelinwebapp.com'
        JOIN auth_roles ON auth_roles.id = auth_role_assignment.auth_role_id AND auth_roles.name = 'admin'
    );

-- Insert the staff account

WITH new_person AS (
    INSERT INTO people (last_name, first_name, updated_at, created_at)
        SELECT 'Test', 'Staff', NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM people WHERE last_name = 'Test' AND first_name = 'Staff'
        )
    RETURNING id AS person_id
), new_user AS (
    INSERT INTO auth_users (person_id, username, password, active, updated_at, created_at)
        SELECT person_id, 'staff@javelinwebapp.com', '$2a$13$wUBEmipbBBExE6ftg67IvOV8yqgID.8GwTa8pm4P0WCL6NeeoeIvS', 't', NOW(), NOW()
        FROM new_person
        WHERE NOT EXISTS (
            SELECT 1 FROM auth_users WHERE username = 'staff@javelinwebapp.com'
        )
    RETURNING person_id, id AS user_id
)

INSERT INTO auth_role_assignment (auth_user_id, auth_role_id, created_at, updated_at)
    SELECT new_user.user_id, (SELECT auth_roles.id FROM auth_roles WHERE auth_roles.name = 'staff'), NOW(), NOW()
    FROM new_user
    WHERE NOT EXISTS (
        SELECT 1 FROM auth_role_assignment
        JOIN auth_users ON auth_users.id = auth_role_assignment.auth_user_id AND auth_users.username = 'staff@javelinwebapp.com'
        JOIN auth_roles ON auth_roles.id = auth_role_assignment.auth_role_id AND auth_roles.name = 'staff'
    );

-- Insert the tutor account

WITH new_person AS (
    INSERT INTO people (last_name, first_name, updated_at, created_at)
        SELECT 'Test', 'Tutor', NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM people WHERE last_name = 'Test' AND first_name = 'Tutor'
        )
    RETURNING id AS person_id
), new_user AS (
    INSERT INTO auth_users (person_id, username, password, active, updated_at, created_at)
        SELECT person_id, 'tutor@javelinwebapp.com', '$2a$13$wUBEmipbBBExE6ftg67IvOV8yqgID.8GwTa8pm4P0WCL6NeeoeIvS', 't', NOW(), NOW()
        FROM new_person
        WHERE NOT EXISTS (
            SELECT 1 FROM auth_users WHERE username = 'tutor@javelinwebapp.com'
        )
    RETURNING person_id, id AS user_id
)

INSERT INTO auth_role_assignment (auth_user_id, auth_role_id, created_at, updated_at)
    SELECT new_user.user_id, auth_roles.id, NOW(), NOW()
    FROM new_user, auth_roles
    WHERE NOT EXISTS (
        SELECT 1 FROM auth_role_assignment
        JOIN auth_users ON auth_users.id = auth_role_assignment.auth_user_id AND auth_users.username = 'tutor@javelinwebapp.com'
        JOIN auth_roles ON auth_roles.id = auth_role_assignment.auth_role_id AND auth_roles.name = 'tutor'
    ) AND auth_roles.name IN ('tutor', 'student');

-- Insert the student account

WITH new_person AS (
    INSERT INTO people (last_name, first_name, updated_at, created_at)
        SELECT 'Test', 'Student', NOW(), NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM people WHERE last_name = 'Test' AND first_name = 'Student'
        )
    RETURNING id AS person_id
), new_user AS (
    INSERT INTO auth_users (person_id, username, password, active, updated_at, created_at)
        SELECT person_id, 'student@javelinwebapp.com', '$2a$13$wUBEmipbBBExE6ftg67IvOV8yqgID.8GwTa8pm4P0WCL6NeeoeIvS', 't', NOW(), NOW()
        FROM new_person
        WHERE NOT EXISTS (
            SELECT 1 FROM auth_users WHERE username = 'student@javelinwebapp.com'
        )
    RETURNING person_id, id AS user_id
)

INSERT INTO auth_role_assignment (auth_user_id, auth_role_id, created_at, updated_at)
    SELECT new_user.user_id, (SELECT auth_roles.id FROM auth_roles WHERE auth_roles.name = 'student'), NOW(), NOW()
    FROM new_user
    WHERE NOT EXISTS (
        SELECT 1 FROM auth_role_assignment
        JOIN auth_users ON auth_users.id = auth_role_assignment.auth_user_id AND auth_users.username = 'student@javelinwebapp.com'
        JOIN auth_roles ON auth_roles.id = auth_role_assignment.auth_role_id AND auth_roles.name = 'student'
    );

-- Generic students

-- INSERT INTO people (grad_year, student_id, first_name, last_name, created_at, updated_at) VALUES
-- (9, 100001, 'Edwin', 'McCullough', NOW(), NOW()),
-- (9, 100002, 'Julien', 'Ledner', NOW(), NOW()),
-- (9, 100003, 'Ryland', 'Bauch', NOW(), NOW()),
-- (9, 100004, 'Bryana', 'Donnelly', NOW(), NOW()),
-- (9, 100005, 'Gage', 'Turcotte', NOW(), NOW()),
-- (9, 100006, 'Julianne', 'Zemlak', NOW(), NOW()),
-- (9, 100007, 'Aurore', 'Cruickshank', NOW(), NOW()),
-- (9, 100008, 'Sunday', 'Kemmer', NOW(), NOW()),
-- (9, 100009, 'Nathalie', 'Kassulke', NOW(), NOW()),
-- (9, 100010, 'Jesica', 'McCullough', NOW(), NOW()),
-- (9, 100011, 'Anita', 'Pfannerstill', NOW(), NOW()),
-- (9, 100012, 'Giancarlo', 'Kohler', NOW(), NOW()),
-- (10, 100013, 'Rianna', 'Blanda', NOW(), NOW()),
-- (10, 100014, 'Westley', 'Eichmann', NOW(), NOW()),
-- (10, 100015, 'Jazlyn', 'Tillman', NOW(), NOW()),
-- (10, 100016, 'Ansel', 'Kuhic', NOW(), NOW()),
-- (10, 100017, 'Levy', 'Langosh', NOW(), NOW()),
-- (10, 100018, 'Kristie', 'Huel', NOW(), NOW()),
-- (10, 100019, 'Theron', 'Barrows', NOW(), NOW()),
-- (10, 100020, 'Albertha', 'Hettinger', NOW(), NOW()),
-- (10, 100021, 'Isaiah', 'Sawayn', NOW(), NOW()),
-- (10, 100022, 'Aarav', 'McClure', NOW(), NOW()),
-- (10, 100023, 'Laraine', 'Kuhlman', NOW(), NOW()),
-- (10, 100024, 'Dorthy', 'Powlowski', NOW(), NOW()),
-- (11, 100025, 'Fitzgerald', 'Kessler', NOW(), NOW()),
-- (11, 100026, 'Erna', 'Nicolas', NOW(), NOW()),
-- (11, 100027, 'Landen', 'VonRueden', NOW(), NOW()),
-- (11, 100028, 'Kala', 'Walsh', NOW(), NOW()),
-- (11, 100029, 'Queenie', 'Larson', NOW(), NOW()),
-- (11, 100030, 'Anthony', 'Hermiston', NOW(), NOW()),
-- (11, 100031, 'Maddux', 'Bode', NOW(), NOW()),
-- (11, 100032, 'Josephus', 'Stroman', NOW(), NOW()),
-- (11, 100033, 'Leander', 'McLaughlin', NOW(), NOW()),
-- (11, 100034, 'Malinda', 'Kuhlman', NOW(), NOW()),
-- (11, 100035, 'Ebba', 'Feil', NOW(), NOW()),
-- (11, 100036, 'Marcelina', 'Koch', NOW(), NOW()),
-- (12, 100037, 'Darell', 'Rempel', NOW(), NOW()),
-- (12, 100038, 'Zelma', 'Harvey', NOW(), NOW()),
-- (12, 100039, 'Danette', 'Jakubowski', NOW(), NOW()),
-- (12, 100040, 'Joretta', 'Adams', NOW(), NOW()),
-- (12, 100041, 'Fabiola', 'Greenfelder', NOW(), NOW()),
-- (12, 100042, 'Deja', 'Friesen', NOW(), NOW()),
-- (12, 100043, 'Kian', 'Jacobson', NOW(), NOW()),
-- (12, 100044, 'Yehuda', 'Green', NOW(), NOW()),
-- (12, 100045, 'Taurean', 'Nolan', NOW(), NOW()),
-- (12, 100046, 'Dustyn', 'Wunsch', NOW(), NOW()),
-- (12, 100047, 'Genevieve', 'Strosin', NOW(), NOW()),
-- (12, 100048, 'Junia', 'Kemmer', NOW(), NOW()),
-- (12, 100049, 'Jaheem', 'Yost', NOW(), NOW()),
-- (12, 100050, 'Myrtice', 'Mayer', NOW(), NOW());
