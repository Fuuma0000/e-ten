import { inputMyprofileJson, returnMyprofileJson } from "./json-convert-type";

const convertMyprofileData = (input: inputMyprofileJson) => {
  const jobs = input.users_jobs.map((myJob) => myJob.jobs.name);
  const courses = input.courses?.name || null;
  const urls = input.users_urls.map((myUrl) => ({
    url_name: myUrl.url_name,
    url: myUrl.url,
  }));

  let works;
  if (input.works_data_users == null) {
    works = null;
  } else {
    works = input.works_data_users.map((myWork) => ({
      work_id: myWork.works_data.id,
      name: myWork.works_data.name,
      genres:
        myWork.works_data.works_data_genres.map(
          (myGenre) => myGenre.genres.name
        ) || null,
      technologies:
        myWork.works_data.works_data_technologies.map(
          (myTechnology) => myTechnology.technologies.name
        ) || null,
      catch_copy: myWork.works_data.catch_copy || null,
      icon_url: myWork.works_data.works_data_images[0].url || null,
    }));
  }

  const returnJson: returnMyprofileJson = {
    user_id: input.id,
    username: input.username,
    enrollment_year: input.enrollment_year,
    graduation_year: input.graduation_year,
    job: jobs,
    icon_url: input.icon_url,
    email: input.email,
    course: courses,
    is_job_hunt_completed: input.is_job_hunt_completed || null,
    self_introduction: input.self_introduction,
    url: urls,
    works: works,
  };

  return returnJson;
};

export { convertMyprofileData };
