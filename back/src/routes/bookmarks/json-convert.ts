type returnBookmarksJson = {
  booksmarks_id: number;
  works_id: number;
  works: work;
}[];

type work = {
  id: number;
  name: string;
  catch_copy: string;
  genres: string[];
  technologies: string[];
  icon_url: string;
};

// TODO: inputの型定義かく
const convertBookmarkData = (input: any) => {
  const returnJson: returnBookmarksJson = [];
  input.forEach((bookmark: any) => {
    const work_data =
      bookmark.works.works_data_works_latest_reviewed_idToworks_data;
    const work: work = {
      id: bookmark.works.id,
      name: work_data.name,
      catch_copy: work_data.catch_copy,
      genres: work_data.works_data_genres.map((genre: any) => {
        return genre.genres.name;
      }),
      technologies: work_data.works_data_technologies.map((technology: any) => {
        return technology.technologies.name;
      }),
      icon_url: work_data.works_data_images[0].url,
    };
    const convertedWork = {
      booksmarks_id: bookmark.id,
      works_id: bookmark.works_id,
      works: work,
    };
    returnJson.push(convertedWork);
  });

  return returnJson;
};

export { convertBookmarkData };
