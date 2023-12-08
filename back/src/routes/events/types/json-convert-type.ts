type inputUsersJson = {
  users: {
    id: number;
    icon_url: string | null;
    username: string | null;
    enrollment_year: number | null;
    graduation_year: number | null;
    users_jobs: {
      jobs: {
        name: string;
      };
    }[];
  };
}[];

type returnUsersJson = {
  user_id: number;
  username: string | null;
  enrollment_year: number | null;
  graduation_year: number | null;
  job: string[];
  icon_url: string | null;
};
