import { works_data_users } from "@prisma/client";

type workReturnType = {
  works_id: number;
  name: string;
  catch_copy: string;
  description: string;
  genres: string[];
  technologies: string[];
  images: string[];
  movie_url: string;
  works_url: string;
  users: {
    user_id: number;
    username: string;
    role: string;
  }[];
  is_bookmarked?: boolean;
};

const convertWorkData = (input: any) => {
  const work_data = input.works_data_works_latest_reviewed_idToworks_data;
  const is_bookmarked = input.bookmarks.length !== 0;

  const returnJson: workReturnType = {
    works_id: work_data.works_id,
    name: work_data.name,
    catch_copy: work_data.catch_copy,
    description: work_data.description,
    genres: work_data.works_data_genres.map(
      (genre: { genres: { name: string } }) => genre.genres.name
    ),
    technologies: work_data.works_data_technologies.map(
      (technology: { technologies: { name: string } }) =>
        technology.technologies.name
    ),
    images: work_data.works_data_images.map(
      (image: { url: string }) => image.url
    ),
    movie_url: work_data.movie_url,
    works_url: work_data.works_url,
    users: work_data.works_data_users.map(
      (user: {
        users: {
          id: number;
          username: string;
          works_data_users: works_data_users[];
        };
      }) => ({
        user_id: user.users.id,
        username: user.users.username,
        role: user.users.works_data_users[0].role_explanation,
      })
    ),
    is_bookmarked: is_bookmarked,
  };

  return returnJson;
};

export { convertWorkData };
