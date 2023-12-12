// まとめるとVsCode上からオブジェクトの型定義が見えなくなるので展開しておく
// type Url = {
//   id: number;
//   url_name: string;
//   url: string;
// };

type RequestBody = {
  user_id: number;
  email: string;
  username: string | undefined;
  enrollment_year: number | undefined;
  graduation_year: number | undefined;
  is_job_hunt_completed: boolean | undefined;
  self_introduction: string | undefined;
  icon_url: string | undefined;
  course_id: number | undefined;
  jobs_id: number[] | undefined;
  urls: {
    id: number;
    url_name: string;
    url: string;
  }[] | undefined;
};

export { RequestBody };