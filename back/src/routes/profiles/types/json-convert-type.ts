// openAPI通りにJSONをコンバートする関数群
type UserType = {
  id: number;
  email: string;
  username: string | null;
  enrollment_year: number | null;
  graduation_year: number | null;
  is_job_hunt_completed: boolean | null;
  self_introduction: string | null;
  icon_url: string | null;
  courses: {
    name: string;
  } | null;
  users_jobs: {
    jobs: {
      name: string;
    };
  }[];
  users_urls: {
    url: string;
    url_name: string;
  }[];
  works_data_users: {
    works_data: {
      catch_copy: string;
      works_works_data_works_idToworks: {
        works_data_works_latest_reviewed_idToworks_data: {
          name: string;
          works_id: number;
          works_data_genres: {
            genres: {
              name: string;
            };
          }[];
          works_data_technologies: {
            technologies: {
              name: string;
            };
          }[];
        } | null;
      };
      works_data_images: {
        url: string | null;
      }[];
    };
  }[];
};

type returnUserJson = {
  user_id: number;
  username: string | null;
  enrollment_year: number | null;
  graduation_year: number | null;
  job: string[];
  icon_url: string | null;
  "e-mail": string;
  course: string | undefined;
  is_job_hunt_completed: boolean | null;
  self_introduction: string | null;
  works: work[];
  urls: url[];
};

type work = {
  work_id: number | undefined;
  name: string | undefined;
  genres: string[] | undefined;
  technologies: string[] | undefined;
  catch_copy: string;
  icon_url: (string | null)[];
};

type url = {
  url_name: string;
  url: string;
};

export { UserType, returnUserJson };
