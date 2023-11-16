```mermaid
erDiagram

    events ||--o{ events_users_roles : ""
    events ||--o{ works : ""
    works ||--o{ works_data : ""
    works_data ||--o{ works_data_genres : ""
    works_data ||--o{ works_data_technologies : ""
    works_data ||--|{ works_data_images : ""
    works_data ||--o{ works_data_users : ""
    works ||--o{ bookmarks : ""
    users ||--o{ works_data_users : ""
    users ||--o{ bookmarks : ""
    users ||--o{ events_users_roles : ""
    users ||--|| courses : ""
    users ||--o{ users_jobs : ""
    users ||--o{ users_urls : ""
    jobs ||--o{ users_jobs : ""
    genres ||--o{ works_data_genres : ""
    technologies ||--o{ works_data_technologies : ""
    roles ||--o{ events_users_roles : ""



    events {
        id INT PK
        name VARCHAR(255)
        start_at DATETIME
        end_at DATETIME
        icon_url VARCHAR(255)
        description TEXT
    }

    users {
        id INT PK
        email VARCHAR(255)
        password VARCHAR(255)
        username VARCHAR(255)
        courses_id INT
        enrollment_year INT
        graduation_year INT
        is_job_hunt_completed BOOLEAN
        self_introduction TEXT
        icon_url VARCHAR(255)
    }

    bookmarks {
        id INT PK
        works_id INT FK
        users_id INT FK
    }

    works {
        works_id INT PK
        events_id INT FK
        latest_reviewed_id INT FK
    }

    works_data {
        id INT PK
        works_id INT FK
        name VARCHAR(255)
        catch_copy VARCHAR(255)
        description VARCHAR(255)
        works_url VARCHAR(255)
        movie_url VARCHAR(255)
        system_diagram_url VARCHAR(255)
        detail TEXT
    }

    genres {
        id INT PK
        name VARCHAR(255)
    }

    technologies {
        id INT PK
        name VARCHAR(255)
    }

    works_data_users {
        works_data_id INT FK
        users_id INT FK
        role_explanation VARCHAR(255)
    }

    users_jobs {
        users_id INT FK
        jobs_id INT FK
    }

    jobs {
        id INT PK
        name VARCHAR(255)
    }

    courses {
        id INT PK
        name VARCHAR(255)
    }

    roles {
        id INT PK
        name VARCHAR(255)
    }

    users_urls {
        id INT PK
        users_id INT FK
        url_name VARCHAR(255)
        url VARCHAR(255)
    }

    works_data_genres {
        works_data_id INT FK
        genres_id INT FK
    }

    works_data_technologies {
        works_data_id INT FK
        technologies_id INT FK
    }

    works_data_images {
        id INT PK
        works_data_id INT FK
        url VARCHAR(255)
        order TINYINT
    }

    events_users_roles {
        events_id INT FK
        users_id INT FK
        roles_id INT FK
    }

```
