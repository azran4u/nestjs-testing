import { DomainError } from './DomainError';

export class ParsingError implements DomainError {
  public message: string;
  constructor(triedToParse: any) {
    this.message = `could not parse ${triedToParse}`;
  }
}
