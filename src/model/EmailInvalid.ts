import { DomainError } from './DomainError';

export class EmailInvalid implements DomainError {
  public message: string;
  constructor(email: string) {
    this.message = `The email ${email} is invalid.`;
  }
}
