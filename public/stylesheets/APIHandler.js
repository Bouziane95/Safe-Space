const token =
  "access_token=pk.eyJ1IjoiYm91Ym91OTUiLCJhIjoiY2tmbWRmdTduMDYxZjM1bWU5ejU3OHU2cyJ9.qVQnw89kJEBWHTsbyV2sBQ";

class APIHandler {
  constructor(baseUrl) {
    this.service = axios.create({
      baseURL: baseUrl,
    });
  }
  createAdress({ lat, lng }) {
    return this.service.get(`/${lng},${lat}.json?${token}`);
  }
}

export default APIHandler;
