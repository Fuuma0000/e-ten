// openAPI通りにJSONをコンバートする関数群
type work = {
  work_id: number;
  name: string;
  genres: string[];
  technologies: string[];
  catch_copy: string;
  icon_url: string[];
};

type url = {
  url_name: string;
  url: string;
};

type UserType = {
  id: number;
  username: string;
  enrollment_year: number;
  graduation_year: number;
  icon_url: string;
  email: string;
  is_job_hunt_completed: boolean;
  self_introduction: string;
  users_jobs: { jobs: { name: string } }[];
  courses: { name: string };
  works_data_users: {
    works_data: {
      works_works_data_works_idToworks: {
        works_data_works_latest_reviewed_idToworks_data: {
          works_id: number;
          name: string;
          works_data_genres: { genres: { name: string } }[];
          works_data_technologies: { technologies: { name: string } }[];
        };
      };
      catch_copy: string;
      works_data_images: { url: string }[];
    };
  }[];
  users_urls: { url_name: string; url: string }[];
};

type returnUserJson = {
  user_id: number;
  username: string;
  enrollment_year: number;
  graduation_year: number;
  job: string[];
  icon_url: string;
  "e-mail": string;
  course: string;
  is_job_hunt_completed: boolean;
  self_introduction: string;
  works: work[];
  urls: url[];
};


export { UserType, returnUserJson }