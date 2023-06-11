const redirectWithQuery = async (route, router) => {
    const query = router.query;
    const locationQuery = {
      location: query?.location
    };
    const queryString = new URLSearchParams(locationQuery).toString();
    const urlWithQuery = `${route}?${queryString}`;
  
    try {
      await router.push(urlWithQuery);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to redirect with query');
    }
  };
  export default redirectWithQuery;