// まとめるとVsCode上からオブジェクトの型定義が見えなくなるので展開しておく
// type Url = {
//   id: number;
//   url_name: string;
//   url: string;
// };

type RequestBody = {
  user_id: number;
  email: string;
  username: string;
  enrollment_year: number;
  graduation_year: number;
  is_job_hunt_completed: boolean;
  self_introduction: string;
  icon_url: string;
  course_id: number;
  jobs_id: number[];
  urls: {
    id: number;
    url_name: string;
    url: string;
  }[];
};

export { RequestBody };