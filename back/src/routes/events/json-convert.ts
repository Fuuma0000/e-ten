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

export { convertUsersData };
