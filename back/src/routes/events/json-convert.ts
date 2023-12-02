// TODO:後で共通化する.多分いけるはず
type inputJob = {
  jobs: {
    name: string;
  }
}

type inputUsersJson = {
  id: number;
  username: string;
  enrollment_year: number;
  graduation_year: number;
  users_jobs: inputJob[];
  icon_url: string;
}

type returnUsersJson = {
  user_id: number;
  username: string;
  enrollment_year: number;
  graduation_year: number;
  job: string[];
  icon_url: string;
}

const convertUsersData = (input: inputUsersJson[]) => {
  const returnJson: returnUsersJson[] = input.map(user => ({
    user_id: user.id,
    username: user.username,
    enrollment_year: user.enrollment_year,
    graduation_year: user.graduation_year,
    job: user.users_jobs.map(jobs => jobs.jobs.name),
    icon_url: user.icon_url
  }));

  return returnJson;
}

export { convertUsersData, inputUsersJson }