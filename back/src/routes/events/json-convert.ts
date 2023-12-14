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
const convertWorksData = (input: any) => {
  const returnJson = {
    events: {
      event_id: input?.events.id,
      name: input?.events.name,
      description: input?.events.description,
      start_at: input?.events.start_at,
      end_at: input?.events.end_at,
    },
    works: {
      works_id: input?.works_data_works_latest_reviewed_idToworks_data?.id,
      name: input?.works_data_works_latest_reviewed_idToworks_data?.name,
      // TODO: 画像
      icon_url:
        input?.works_data_works_latest_reviewed_idToworks_data
          ?.works_data_images[0]?.url,
      catch_copy:
        input?.works_data_works_latest_reviewed_idToworks_data?.catch_copy,
      genres:
        input?.works_data_works_latest_reviewed_idToworks_data?.works_data_genres.map(
          (genre: { genres: { name: any } }) => genre.genres.name
        ),
      technologies:
        input?.works_data_works_latest_reviewed_idToworks_data?.works_data_technologies.map(
          (technology: { technologies: { name: any } }) =>
            technology.technologies.name
        ),
    },
  };

  return returnJson;
};

export { convertUsersData, inputUsersJson, convertWorksData };
