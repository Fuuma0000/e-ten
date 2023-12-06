const convertWorkData = (work: any) => {
  const returnJson = {
    work_id: work?.id,
    name: work?.name,
    catch_copy: work?.catch_copy,
    description: work?.description,
    genres: work?.works_data_genres.map(
      (genre: { genres: { name: any } }) => genre.genres.name
    ),
    technologies: work?.works_data_technologies.map(
      (technology: { technologies: { name: any } }) =>
        technology.technologies.name
    ),
    images: work?.works_data_images.map((image: { url: any }) => image.url),
    movie_url: work?.movie_url,
    works_url: work?.works_url,
    users: work?.works_data_users.map(
      (user: {
        users: {
          id: any;
          username: any;
          event_users_roles: { roles: { name: any } };
        };
      }) => ({
        user_id: user.users.id,
        username: user.users.username,
        // TODO: role
        // role: user.users.event_users_roles.map((role: { roles: { name: any } }) => role.roles.name)
      })
    ),
  };
};
