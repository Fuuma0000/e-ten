import { inputUsersJson, returnUsersJson } from "./types/json-convert-type";
const convertUsersData = (input: inputUsersJson) => {
  const returnJson: returnUsersJson[] = input.map((user) => ({
    user_id: user.users.id,
    username: user.users.username,
    enrollment_year: user.users.enrollment_year,
    graduation_year: user.users.graduation_year,
    job: user.users.users_jobs.map((jobs) => jobs.jobs.name),
    icon_url: user.users.icon_url,
  }));

  return returnJson;
};

// TODO: 型を定義する
const convertWorksData = (input: any[]) => {
  const returnJson = input.map((work_data) => {
    const work_data_ref =
      work_data.works_data_works_latest_reviewed_idToworks_data;
    return {
      work_id: work_data_ref?.id,
      name: work_data_ref?.name,
      icon_url: work_data_ref?.works_data_images[0]?.url,
      catch_copy: work_data_ref?.catch_copy,
      genres: work_data_ref?.works_data_genres.map(
        (genre: { genres: { name: any } }) => genre.genres.name
      ),
      technologies: work_data_ref?.works_data_technologies.map(
        (technology: { technologies: { name: any } }) =>
          technology.technologies.name
      ),
    };
  });

  return returnJson;
};

export { convertUsersData, inputUsersJson, convertWorksData };
