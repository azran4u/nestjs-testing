import { DomainError } from '../model/DomainError';

export class CatsFactsInvalid implements DomainError {
  public message: string;
  constructor(fact: any) {
    this.message = `The fact ${fact} is invalid.`;
  }
}
