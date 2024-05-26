export class Author {
  constructor(
    public displayName: string,
    public url: string,
    public _links: { avatar: { href: string, }, },
    public id: string,
    public uniqueName: string,
    public imageUrl: string,
    public descriptor: string,
  ) { }
}
