type inputJob = {
  jobs: {
    name: string;
  }
}

type inputUsersJson = {
  users: {
    id: number;
    username: string;
    enrollment_year: number;
    graduation_year: number;
    users_jobs: inputJob[];
    icon_url: string;
  }
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
    user_id: user.users.id,
    username: user.users.username,
    enrollment_year: user.users.enrollment_year,
    graduation_year: user.users.graduation_year,
    job: user.users.users_jobs.map(jobs => jobs.jobs.name),
    icon_url: user.users.icon_url
  }));

  return returnJson;
}

export { convertUsersData, inputUsersJson }