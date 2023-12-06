// openAPI通りにJSONをコンバートする関数群
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
}

type work = {
  work_id: number;
  name: string;
  genres: string[];
  technologies: string[];
  catch_copy: string;
  icon_url: string[];
}

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
};

const convertUserData = (input: UserType) => {
  const job = input.users_jobs.map(job => job.jobs.name);
  
  const works = input.works_data_users.map(works_data_user => ({
    work_id: works_data_user.works_data.works_works_data_works_idToworks.works_data_works_latest_reviewed_idToworks_data.works_id,
    name: works_data_user.works_data.works_works_data_works_idToworks.works_data_works_latest_reviewed_idToworks_data.name,
    genres: works_data_user.works_data.works_works_data_works_idToworks.works_data_works_latest_reviewed_idToworks_data.works_data_genres.map(works_data_genre => works_data_genre.genres.name),
    technologies: works_data_user.works_data.works_works_data_works_idToworks.works_data_works_latest_reviewed_idToworks_data.works_data_technologies.map(
      works_data_technology => works_data_technology.technologies.name
    ),
    catch_copy: works_data_user.works_data.catch_copy,
    icon_url: works_data_user.works_data.works_data_images.map(works_data_image => works_data_image.url)
  }));

  const returnJson: returnUserJson = {
    user_id: input.id,
    username: input.username,
    enrollment_year: input.enrollment_year,
    graduation_year: input.graduation_year,
    job,
    icon_url: input.icon_url,
    "e-mail": input.email,
    course: input.courses.name,
    is_job_hunt_completed: input.is_job_hunt_completed,
    self_introduction: input.self_introduction,
    works 
  }
  return returnJson;
}

export { convertUserData, UserType }