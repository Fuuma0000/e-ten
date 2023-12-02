// openAPI通りにJSONをコンバートする関数群
type inputJob = {
  jobs: {
    name: string;
  }
}

type inputCourse = {
  name: string;
}

type inputUserJson = {
  id: number;
  username: string;
  enrollment_year: number;
  graduation_year: number;
  icon_url: string;
  email: string;
  is_job_hunt_completed: boolean;
  self_introduction: string;
  users_jobs: inputJob[];
  courses: inputCourse;
}

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
}

const convertUserData = (input: inputUserJson) => {
  const job = input.users_jobs.map(userJob => userJob.jobs.name);

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
    self_introduction: input.self_introduction
  }
  return returnJson;
}



type inputGenre = {
  genres: {
    name: string;
  }
}

type inputTechnology = {
  technologies: {
    name: string;
  }
}

type inputImageUrl = {
  url: string;
}

type inputWorksJson = {
  works_id: number;
  name: string;
  works_data_genres: inputGenre[];
  works_data_technologies: inputTechnology[];
  catch_copy: string;
  works_data_images: inputImageUrl[];
}

type returnWorksJson = {
  work_id: number;
  name: string;
  genres: string[];
  technologies: string[];
  catch_copy: string;
  icon_url: string;
}

const convertWorksData = (input: inputWorksJson) => {
  const genres = input.works_data_genres.map(genre => genre.genres.name);
  const technologies = input.works_data_technologies.map(technology => technology.technologies.name);
  const icon_url = input.works_data_images[0].url;

  const returnJson: returnWorksJson[] = [{
    work_id: input.works_id,
    name: input.name,
    genres,
    technologies,
    catch_copy: input.catch_copy,
    icon_url
  }];
  return { works: returnJson };
}


export { convertUserData, convertWorksData, inputUserJson, inputWorksJson }