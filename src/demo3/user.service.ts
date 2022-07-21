import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UserService {
  private url = 'https://catfact.ninja/fact';

  async getCatFacts() {
    try {
      const res = await axios.get(this.url);
      const fact = res?.data?.fact;
      if (!fact) throw new InternalServerErrorException();
      return fact;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
