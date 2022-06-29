import path from 'path';

class AppConfig {
  BASE_DIR = path.join(__dirname, '../../');
  BASE_URL = '/api/v1';
  API_BASE_ENDPOINT = `${this.BASE_URL}/auth`;
}

export default new AppConfig();
