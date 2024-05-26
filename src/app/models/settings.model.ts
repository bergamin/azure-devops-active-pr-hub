export class Settings {
  constructor(
    public base64pat = '',
    public organization = '',
    public project = '',
    public types: string[] = [],
    public stageStatus: string[] = [],
    public mergeStatus: string[] = [],
    public reviewStatus: string[] = [],
    public authors: string[] = [],
    public reviewers: string[] = [],
    public repositories: string[] = [],
    public labels: string[] = [],
  ) { }
}
