type inputMyprofileJson = {
  id: number;
  username: string | null;
  enrollment_year: number | null;
  graduation_year: number | null;
  icon_url: string | null;
  email: string | null;
  courses: { name: string } | null;
  users_jobs: {
    jobs: {
      name: string;
    };
  }[];
  is_job_hunt_completed: boolean | null;
  self_introduction: string | null;
  users_urls: {
    url_name: string;
    url: string;
  }[];
  works_data_users:
    | {
        works_data: {
          id: number;
          name: string;
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
          catch_copy: string | null;
          works_data_images: {
            url: string;
          }[];
        };
      }[]
    | null;
};

type returnMyprofileJson = {
  user_id: number;
  username: string | null;
  enrollment_year: number | null;
  graduation_year: number | null;
  job: string[] | null;
  icon_url: string | null;
  email: string | null;
  course: string | null;
  is_job_hunt_completed: boolean | null;
  self_introduction: string | null;
  url: {
    url_name: string;
    url: string;
  }[];
  works:
    | {
        work_id: number;
        name: string | null;
        genres: string[] | null;
        technologies: string[] | null;
        catch_copy: string | null;
        icon_url: string | null;
      }[]
    | null;
};

export { inputMyprofileJson, returnMyprofileJson };
