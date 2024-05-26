export class Reviewer {
  constructor(
    public reviewerUrl: string,
    public vote: number,
    public hasDeclined: boolean,
    public isRequired: boolean,
    public isFlagged: boolean,
    public displayName: string,
    public url: string,
    public _links: { avatar: { href: string, }, },
    public id: string,
    public uniqueName: string,
    public imageUrl: string,
    public isContainer: boolean,
  ) { }
}
