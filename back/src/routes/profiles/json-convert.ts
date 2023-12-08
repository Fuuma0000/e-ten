import { UserType, returnUserJson } from "./types/json-convert-type";

const convertUserData = (input: UserType) => {
  const job = input.users_jobs.map((currentJob) => currentJob.jobs.name);
  const urls = input.users_urls.map((currentUrl) => ({ url_name: currentUrl.url_name, url: currentUrl.url }));

  const works = input.works_data_users.map((works_data_user) => {
    const latestWorksDataRef = works_data_user.works_data.works_works_data_works_idToworks.works_data_works_latest_reviewed_idToworks_data;

    return {
      work_id: latestWorksDataRef?.works_id,
      name: latestWorksDataRef?.name,
      genres:latestWorksDataRef?.works_data_genres.map(
          (currentGenre) => currentGenre.genres.name
        ),
      technologies:
        latestWorksDataRef?.works_data_technologies.map(
          (currentTechnology) => currentTechnology.technologies.name
        ),
      catch_copy: works_data_user.works_data.catch_copy,
      icon_url: works_data_user.works_data.works_data_images.map(
        (currentImage) => currentImage.url
      ),
    };
  });

  const returnJson: returnUserJson = {
    user_id: input.id,
    username: input.username,
    enrollment_year: input.enrollment_year,
    graduation_year: input.graduation_year,
    job,
    icon_url: input.icon_url,
    "e-mail": input.email,
    course: input.courses?.name,
    is_job_hunt_completed: input.is_job_hunt_completed,
    self_introduction: input.self_introduction,
    works,
    urls,
  };
  return returnJson;
};

export { convertUserData, UserType };
