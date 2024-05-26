import {Repository} from "./repository.model";
import {Author} from "./author.model";
import {Reviewer} from "./reviewer.model";
import {Label} from "./label.model";

export class PullRequest {
  constructor(
    public repository: Repository,
    public pullRequestId: number,
    public codeReviewId: number,
    public status: string,
    public createdBy: Author,
    public creationDate: string,
    public title: string,
    public description: string,
    public sourceRefName: string,
    public targetRefName: string,
    public mergeStatus: string,
    public isDraft: boolean,
    public mergeId: string,
    public lastMergeSourceCommit: any,
    public lastMergeTargetCommit: any,
    public lastMergeCommit: any,
    public reviewers: Reviewer[],
    public labels: Label[],
    public url: string,
    public completionOptions: any,
    public supportsIterations: string,
    public autoCompleteSetBy: any,

    public reviewStatus: string,
    public generalStatus: string,
    public type: string,
    public isTargetValid: boolean,
  ) { }
}
