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
        name VARCHAR(50)
        start_at DATETIME
        end_at DATETIME
        icon_url VARCHAR(255)
        description TEXT
        created_at DATETIME
        updated_at DATETIME
        deleted_at DATETIME
    }

    courses {
        id INT PK
        name VARCHAR(30)
    }

    users {
        id INT PK
        email VARCHAR(255)
        password VARCHAR(50)
        username VARCHAR(50)
        courses_id INT
        enrollment_year INT
        graduation_year INT
        is_job_hunt_completed BOOLEAN
        self_introduction TEXT
        icon_url VARCHAR(255)
    }

    genres {
        id INT PK
        name VARCHAR(30)
    }

    technologies {
        id INT PK
        name VARCHAR(30)
    }

    jobs {
        id INT PK
        name VARCHAR(30)
    }

    roles {
        id INT PK
        name VARCHAR(30)
    }

    works {
        id INT PK
        events_id INT FK
        latest_reviewed_id INT FK
    }

    works_data {
        id INT PK
        works_id INT FK
        name VARCHAR(100)
        catch_copy VARCHAR(100)
        description VARCHAR(500)
        works_url VARCHAR(255)
        movie_url VARCHAR(255)
        system_diagram_url VARCHAR(255)
        detail TEXT
    }

    bookmarks {
        id INT PK
        works_id INT FK
        users_id INT FK
    }

    works_data_users {
        works_data_id INT FK
        users_id INT FK
        role_explanation VARCHAR(50)
    }

    users_jobs {
        users_id INT FK
        jobs_id INT FK
    }

    users_urls {
        id INT PK
        users_id INT FK
        url_name VARCHAR(30)
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
